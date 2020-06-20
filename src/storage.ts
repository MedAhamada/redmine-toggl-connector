import { StoreEntry } from "./interfaces";
import {browser} from "webextension-polyfill-ts";

export function get(keys, callback?: Function) {
    let item = browser.storage.local.get(keys);
    item.then((result)=> {
        if (callback) callback(result);
    });
}

export function store(data, callback?: Function) {
    browser.storage.local
        .set(data)
        .then(()=> {
            if (callback) callback();
        });
}

export function clearStore(callback?: Function) {
    browser.storage.local
        .clear()
        .then(()=> {
            if (callback) callback();
        });
}

export function storeEntry(entry: StoreEntry, callback?: Function) {
    get(['synced_guid'], function (result) {
        console.log(result);
        if (!result.synced_guid ){
            result = {synced_guid: {}};
        }

        if (result.synced_guid[entry.guid] != entry.guid) {
            result.synced_guid[entry.guid] = entry.guid;
            store({synced_guid: result.synced_guid}, callback)
        }
    })
}
