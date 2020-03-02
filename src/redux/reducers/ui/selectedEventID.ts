import State from "../../State"
import { SelectEvent } from "../../actions/ui/selectEvent"
import { LoadEvents } from "../../actions/events/loadEvents"
import { Undo } from "../../actions/dataHistory/undo"

export default reducer

type ReducerState = State["ui"]["selectedEventID"]
type Action = SelectEvent | LoadEvents | Undo
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
        case "UNDO": {
            if (action.payload.id === state && action.payload.event === null) {
                return null
            } else {
                return state
            }
        }
        default: return state
    }
}
