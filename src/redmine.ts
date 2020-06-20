import * as $ from 'jquery';
import {RedmineConfig, RedmineEntryTime} from "./interfaces";
import {notify} from "./util";
import {get, store, storeEntry} from "./storage";

export function sendEntries(callback?: Function) {
    $('.issue-check:checked').each(function (index, element) {
        const hours = $(element).data('hours');
        const issue_id = $(element).data('issue-id');
        let rowElmt = $(element).parent().parent().parent();
        let message = $('.r_entry_message', rowElmt).val().toString();
        const guid = rowElmt.data('entry-guid');
        message = message + ' This entry has been automatically saved by @alfred from '+ guid +'.';

        get(['redmineKey', 'redmineHost'], function (result) {
            const redmineConfig: RedmineConfig = {host: result.redmineHost, key: result.redmineKey};
            const entry: RedmineEntryTime = {hours: hours, message: message, issue_id: issue_id, toggl_guid: guid};
            postEntry(entry, redmineConfig);
        })
    });
}

function prepareRedmineTimeEntry(hours, issue_id, message) {
    const html = `
            <time_entry>
              <hours>${hours}</hours>
              <issue_id>${issue_id}</issue_id>
              <comments>${message}</comments>
            </time_entry>
            `;
    return html;
}

export function postEntry(entry: RedmineEntryTime, redmineConfig: RedmineConfig, successCallback = null, errorCallback = null) {
    const url = redmineConfig.host + '/time_entries.xml?key=' + redmineConfig.key;

    $.ajax({
        url: url,
        method: 'POST',
        data: prepareRedmineTimeEntry(entry.hours, entry.issue_id, entry.message),
        headers: {
            'Content-Type': 'application/xml'
        },
        success: function (data) {
            storeEntry({ guid: entry.toggl_guid}, ()=>{ window.location.reload(); });
        },
        error: function (error) {
            notify(error.responseText ? error.responseText : error.statusText, 'danger');
            if (errorCallback) errorCallback(error)
        }
    });
}
