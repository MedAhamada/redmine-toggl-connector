import * as $ from "jquery";
import * as moment from "moment-timezone";

export function notify(message, type) {
    const id = moment().valueOf();

    $('#notification-center').append(`
<p id="notification-${id}">
    <span class="alert alert-${type}">${message}</span>
</p>
  `);
    setTimeout(() => { $('#notification-' + id).remove(); }, 5000);
}

export function sum(a, b) {
    return a + b;
}
