import { Action } from "redux"
import Event from "../../../Event"
import uuid = require("uuid")

export default createEvent
export { CreateEvent, CREATE_EVENT }


const CREATE_EVENT = "CREATE_EVENT"

interface CreateEvent extends Action {
    type: typeof CREATE_EVENT
    payload: {
        event: Event
    }
}

function createEvent(data: Partial<Event>) {
    const event: Event = {
        title: "Neues Event",
        start: null,
        end: null,
        ...data,
        id: uuid.v4(),
    }

    return {
        type: CREATE_EVENT,
        payload: { event },
    }
}
