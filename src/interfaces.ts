export interface TogglEntry {
    at: string //"2020-06-15T14:30:10+00:00"
    billable: boolean // false
    description: string // "MDSAP - Bug #19 "
    duration: number // 3863
    duronly: boolean // false
    guid: string // "1a3c412ce14a87173a2eb4d572555584"
    id: number // 1585906367
    pid: number // 152584722
    start: string // "2020-06-15T13:25:46+00:00"
    stop: string // "2020-06-15T14:30:09+00:00"
    uid: number // 3769974
    wid: number // 2544172
}

export interface TogglKey {
    togglKey: string
}

export interface StoreEntry {
    guid: string
}

export interface RedmineEntryTime {
    hours: number;
    message?: string;
    toggl_guid?: string;
    issue_id: number;
}

export interface RedmineConfig {
    key: string;
    host: string;
}
