import State from "../../State"
import { SetAutoSave } from "../../actions/ui/setAutoSave"

export default reducer

type ReducerState = State["ui"]["autoSave"]
type Action = SetAutoSave
const defaultState: ReducerState = localStorage.getItem("autoSave") === "true"


function reducer(state = defaultState, action: Action): ReducerState {
    switch (action.type) {
        case "SET_AUTO_SAVE": return action.payload.autoSave
        default: return state
    }
}
