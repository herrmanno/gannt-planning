import State from "../../State"
import { SelectEvent } from "../../actions/ui/selectEvent"
import { LoadEvents } from "../../actions/events/loadEvents"

export default reducer

type ReducerState = State["ui"]["selectedEventID"]
type Action = SelectEvent | LoadEvents
const defaultState: ReducerState = null


function reducer(state = defaultState, action: Action): ReducerState {
    switch (action.type) {
        case "SELECT_EVENT": {
            return action.payload.id
        }
        case "LOAD_EVENTS": {
            const ids = new Set(action.payload.events.map(event => event.id))
            if (!ids.has(state)) {
                return null
            } else {
                return state
            }
        }
        default: return state
    }
}
