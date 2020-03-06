import { Action } from "redux"
import { SerializedEvent } from "./../../../Event"
import State from "../../State"
import { addDays, format } from "date-fns"

export default loadEvents
export { LoadEvents, LOAD_EVENTS }


const LOAD_EVENTS = "LOAD_EVENTS"

interface LoadEvents extends Action {
    type: typeof LOAD_EVENTS
    payload: {
        events: SerializedEvent[]
    }
}

function loadEvents(): any {
    return async (dispatch: Function, getState: () => State) => {
        const { startDate, numDays } = getState().ui
        const start = format(startDate, "yyyy-MM-dd")
        const end = format(addDays(startDate, numDays), "yyy-MM-dd")
        const res = await fetch(`api/events?start=${start}&end=${end}`)
        const events = await res.json()

        dispatch({
            type: LOAD_EVENTS,
            payload: { events }
        } as LoadEvents)
    }
}
