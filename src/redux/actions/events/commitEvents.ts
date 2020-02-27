import { Action } from "redux"
import { format } from "date-fns"
import ReduxState from "../../State"

export default commitEvents
export { CommitEvents, COMMIT_EVENTS }


const COMMIT_EVENTS = "COMMIT_EVENTS"

interface CommitEvents extends Action {
    type: typeof COMMIT_EVENTS
    payload: {}
}

function commitEvents(): any {
    return async (dispatch: Function, getState: () => ReduxState) => {
        const events = getState().data.events.map(event => {
            return {
                ...event,
                start: format(event.start, "yyyy-MM-dd"),
                end: format(event.end, "yyyy-MM-dd"),
            }
        })

        await fetch("http://localhost:8080/api/events", {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(events.filter(e => e._state))
        })

        dispatch({
            type: COMMIT_EVENTS,
            payload: { event },
        } as CommitEvents)
    }
}
