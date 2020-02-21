import State from "../../State"
import { LoadUsers } from "../../actions/users/loadUsers"

export default reducer

type ReducerState = State["data"]["users"]
type Action = LoadUsers
const defaultState: ReducerState = []


function reducer(state = defaultState, action: Action): ReducerState {
    switch (action.type) {
        case "LOAD_USERS": return action.payload.users
        default: return state
    }
}
