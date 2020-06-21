import * as $ from "jquery";

export function doPost(options) {
    options.method = 'POST';

    $.ajax(options);
}

export function doGet(options) {
    options.method = 'GET';

    $.ajax(options);
}
