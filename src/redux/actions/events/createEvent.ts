import { Action } from "redux"
import Event from "../../../Event"
import uuid = require("uuid")
import addUndoAction from "../dataHistory/addUndoAction"

export default createEvent
export { CreateEvent, CREATE_EVENT }


const CREATE_EVENT = "CREATE_EVENT"

interface CreateEvent extends Action {
    type: typeof CREATE_EVENT
    payload: {
        event: Event
    }
}

function createEvent(data: Partial<Event>, onCreate?: (event: Event) => any) {
    return async (dispatch: Function) => {
        const event: Event = {
            title: "Neues Event",
            start: new Date(),
            end: new Date(),
            ...data,
            id: uuid.v4(),
        }

        if (onCreate) {
            await onCreate(event)
        }

        dispatch(addUndoAction(event.id, null))

        dispatch({
            type: CREATE_EVENT,
            payload: { event },
        } as CreateEvent)

        return event
    }
}
