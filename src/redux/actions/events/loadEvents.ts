import { Action } from "redux"
import { RawData } from "../../../data"

export default loadEvents
export { LoadEvents, LOAD_EVENTS }


const LOAD_EVENTS = "LOAD_EVENTS"

interface LoadEvents extends Action {
    type: typeof LOAD_EVENTS
    payload: {
        events: RawData[]
    }
}

function loadEvents(): any {
    return async (dispatch: Function) => {
        const events = JSON.parse(localStorage.getItem("events") || "[]")
        dispatch({
            type: LOAD_EVENTS,
            payload: { events }
        } as LoadEvents)
    }
}
