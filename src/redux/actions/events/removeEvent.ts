import { Action } from "redux"
import { Data } from "../../../data"
import uuid = require("uuid")

export default removeEvent
export { RemoveEvent, REMOVE_EVENT }


const REMOVE_EVENT = "REMOVE_EVENT"

interface RemoveEvent extends Action {
    type: typeof REMOVE_EVENT
    payload: {
        id: string
    }
}

function removeEvent(id: string): RemoveEvent {
    return {
        type: REMOVE_EVENT,
        payload: { id }
    }
}
