import State from "../../State"
import { SetNumDays } from "../../actions/ui/setNumDays"

export default reducer


type ReducerState = State["ui"]["numDays"]
type Action = SetNumDays
const defaultState: ReducerState = ~~(document.body.clientWidth / 350) * 7


function reducer(state = defaultState, action: Action): ReducerState {
    switch (action.type) {
        case "SET_NUMDAYS": return action.payload.numDays
        default: return state
    }
}
