interface BaseEvent {
    id: string
    title: string
    color: string
    userID?: string
}

export default interface Event extends BaseEvent {
    start: Date
    end: Date
}

export interface SerializedEvent extends BaseEvent {
    start: string
    end: string
}
