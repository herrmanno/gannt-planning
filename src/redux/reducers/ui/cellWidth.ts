import State from "../../State"
import { SetCellWidth } from "../../actions/ui/setCellWidth"

export default reducer


type ReducerState = State["ui"]["cellWidth"]
type Action = SetCellWidth
const defaultState: ReducerState = 0


function reducer(state = defaultState, action: Action): ReducerState {
    switch (action.type) {
        case "SET_CELLWIDTH": return action.payload.cellWidth
        default: return state
    }
}
