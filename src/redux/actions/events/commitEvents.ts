import { Action } from "redux"
import { format } from "date-fns"
import ReduxState from "../../State"
import selectChangedEvents from "../../selectors/selectChangedEvents"

export default commitEvents
export { CommitEvents, COMMIT_EVENTS }


const COMMIT_EVENTS = "COMMIT_EVENTS"

interface CommitEvents extends Action {
    type: typeof COMMIT_EVENTS
    payload: {}
}

function commitEvents(): any {
    return async (dispatch: Function, getState: () => ReduxState) => {
        const changedEvents = selectChangedEvents(getState()).map(event => {
            return {
                ...event,
                start: format(event.start, "yyyy-MM-dd"),
                end: format(event.end, "yyyy-MM-dd"),
            }
        })

        await fetch(`api/events`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(changedEvents)
        })

        dispatch({
            type: COMMIT_EVENTS,
            payload: { event },
        } as CommitEvents)
    }
}
