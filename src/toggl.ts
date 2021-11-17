import * as moment from 'moment-timezone';
import * as $ from 'jquery';
import {TogglEntry, TogglKey} from "./interfaces";
import {notify} from "./util";
import {get} from "./storage";
import {doGet} from "./api";

export class Toggl {

    public static API_END_POINT = 'https://api.track.toggl.com/api/v8';

    public static buildHtml(entry: TogglEntry, synced: boolean = false): string {
        const description = entry.description ? entry.description : '';
        const pattern =  /(.*) #([0-9]*): (.*)/i;
        const issue_id = description.match(pattern) ? description.match(pattern)[2] : null;

        const r_entry = {
            "issue_id": issue_id,
            "hours": entry.duration/3600
        };

        let html = '';

        if (r_entry.issue_id) {
            let checkBox = synced
                ? ''
                : `<input class="form-check-input issue-check" data-hours="${r_entry.hours}" data-issue-id="${r_entry.issue_id}" type="checkbox">`;

            let text = synced
                ? `<h6>This entry has already been synced</h6>`
                :`<textarea class="r_entry_message" placeholder="Message"></textarea>`;

            html = `
<div>
    <div class="row r_entry" data-entry-guid="${entry.guid}" data-spent-on="${entry.at}">
        <div class="col-5">
            <div class="form-check">
              ${checkBox}
              <label class="form-check-label">
                <a href="http://redmine.mit.co.ma/issues/${r_entry.issue_id}">${entry.description}</a> - <span class="text-muted font-italic">${moment(entry.at).format('DD/MM/YYYY')}</span>
              </label>
            </div>               
        </div>
        <div  class="col-2 r_entry_hours" data-hours="${r_entry.hours}">${r_entry.hours.toFixed(2)} hrs</div>
        <div class="col-5">${text}</div>
    </div>
    <hr>
</div>
        
`;
        }

        return html;
    }

    public static fetchEntries(togglKey: TogglKey, range='today') {
        const key = 'Basic ' + btoa(togglKey.togglKey+':api_token');
        let day_start = moment().startOf('year').tz("Africa/Casablanca").toISOString();

        switch (range) {
            case 'today':
                day_start = moment().startOf('day').tz("Africa/Casablanca").toISOString();
                break;
            case 'week':
                day_start = moment().startOf('isoWeek').tz("Africa/Casablanca").toISOString();
                break;
            case 'month':
                day_start = moment().startOf('month').tz("Africa/Casablanca").toISOString();
                break;
            case 'year':
                day_start = moment().startOf('year').tz("Africa/Casablanca").toISOString();
                break;
        }

        const day_end = moment().tz("Africa/Casablanca").toISOString();

        doGet({
            url: Toggl.API_END_POINT + '/time_entries?start_date='+day_start+'&end_date='+day_end,
            headers: {
                'Authorization': key,
                'Accept': 'application/json'
            },
            success: function(data: Array<TogglEntry>) {
                $('#entries').children().remove();
                get(['synced_guid'], function (result) {

                    data.forEach((entry: TogglEntry)=> {
                        const html = Toggl.buildHtml(entry, result.synced_guid && result.synced_guid[entry.guid] == entry.guid);
                        $('#entries').append(html);
                    });
                })
            },
            error: function (error) {
                const message = error.responseText ? error.responseText : error.statusText;

                notify(message, 'danger');
                console.error(error);
            }
        });
    }
}
