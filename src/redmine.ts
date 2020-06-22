import * as $ from 'jquery';
import {RedmineConfig, RedmineEntryTime} from "./interfaces";
import {notify} from "./util";
import {get, store, storeEntry} from "./storage";
import moment = require("moment-timezone");
import {doPost} from "./api";

export function sendEntries(callback?: Function) {
    get(['redmineKey', 'redmineHost'], function (result) {
        $('.issue-check:checked').each(function (index, element) {
            const hours = $(element).data('hours');
            const issue_id = $(element).data('issue-id');
            let rowElmt = $(element).parent().parent().parent();
            let message = $('.r_entry_message', rowElmt).val().toString();
            const guid = rowElmt.data('entry-guid');
            const spent_on = rowElmt.data('spent-on');
            message = message + ' This entry has been automatically saved by @alfred from '+ guid +'.';
            const redmineConfig: RedmineConfig = {host: result.redmineHost, key: result.redmineKey};
            const entry: RedmineEntryTime = {hours: hours, message: message, issue_id: issue_id, toggl_guid: guid, spent_on: spent_on};

            postEntry(entry, redmineConfig, ()=>{
                $('.issue-check', rowElmt).remove();
                $('.r_entry_message', rowElmt).parent().text('');
                $('.r_entry_message', rowElmt).parent().append(`<h6>This entry has already been synced</h6>`);

            });
        });
    });
}

function prepareRedmineTimeEntry(hours, issue_id, message, date: string = null) {
    date = date == null
        ? moment().format('YYYY-MM-DD')
        : moment(date).format('YYYY-MM-DD');

    const html = `
            <time_entry>
              <hours>${hours}</hours>
              <issue_id>${issue_id}</issue_id>
              <comments>${message}</comments>
              <spent_on>${date}</spent_on>
            </time_entry>
            `;
    return html;
}

export function postEntry(entry: RedmineEntryTime, redmineConfig: RedmineConfig, successCallback = null, errorCallback = null) {
    const url = redmineConfig.host + '/time_entries.xml?key=' + redmineConfig.key;

    doPost({
        url: url,
        data: prepareRedmineTimeEntry(entry.hours, entry.issue_id, entry.message, entry.spent_on),
        headers: {
            'Content-Type': 'application/xml'
        },
        success: function (data) {
            storeEntry({ guid: entry.toggl_guid});
            if (successCallback) successCallback();
        },
        error: function (error) {
            notify(error.responseText ? error.responseText : error.statusText, 'danger');
            if (errorCallback) errorCallback(error);
            console.log(error);
        }
    });
}
