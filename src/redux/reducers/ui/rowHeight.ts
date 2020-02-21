import State from "../../State"

export default reducer


type ReducerState = State["ui"]["rowHeight"]
type Action = null
const defaultState: ReducerState = 40


function reducer(state = defaultState, action: Action): ReducerState {
    return state
}
