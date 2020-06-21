import { StoreEntry } from "./interfaces";
import {browser} from "webextension-polyfill-ts";
import {notify} from "./util";

export function get(keys, callback?: Function) {
    browser.storage.local
        .get(keys)
        .then((result)=> {
            if (callback) callback(result);
        })
        .catch((error)=> {
            notify('An error occurred', 'danger');
            console.error(error)
        })
    ;
}

export function store(data, callback?: Function) {
    browser.storage.local
        .set(data)
        .then(()=> {
            if (callback) callback();
        })
        .catch((error)=> {
            notify('An error occurred', 'danger');
            console.error(error)
        })
    ;
}

export function clearStore(callback?: Function) {
    browser.storage.local
        .clear()
        .then(()=> {
            if (callback) callback();
        })
        .catch((error)=> {
            notify('An error occurred', 'danger');
            console.error(error)
        })
    ;
}

export function storeEntry(entry: StoreEntry, callback?: Function) {
    get(['synced_guid'], function (result) {
        if (!result.synced_guid ){
            result = {synced_guid: {}};
        }
        if (result.synced_guid[entry.guid] != entry.guid) {
            result.synced_guid[entry.guid] = entry.guid;
            store({synced_guid: result.synced_guid}, callback)
        }
    })
}
