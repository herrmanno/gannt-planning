import State from "../../State"
import { SelectEvent } from "../../actions/ui/selectEvent"

export default reducer

type ReducerState = State["ui"]["selectedEventID"]
type Action = SelectEvent
const defaultState: ReducerState = null


function reducer(state = defaultState, action: Action): ReducerState {
    switch (action.type) {
        case "SELECT_EVENT": return action.payload.id
        default: return state
    }
}
