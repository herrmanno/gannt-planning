import State from "../../State"
import { LoadProjects } from "../../actions/projects/loadProjects"

export default reducer

type ReducerState = State["data"]["projects"]
type Action = LoadProjects
const defaultState: ReducerState = []


function reducer(state = defaultState, action: Action): ReducerState {
    switch (action.type) {
        case "LOAD_PROJECTS": return action.payload.projects
        default: return state
    }
}
