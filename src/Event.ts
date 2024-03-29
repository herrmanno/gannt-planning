interface BaseEvent {
    id: string
    title: string
    description?: string
    userIDs: string[]
    projectID?: string
}

export default interface Event extends BaseEvent {
    start: Date
    end: Date
}

export interface SerializedEvent extends BaseEvent {
    start: string
    end: string
}
