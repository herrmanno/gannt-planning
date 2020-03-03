import State from "../../State"
import { SetAdditionalLaneCategory } from "../../actions/ui/setAdditionalLaneCategory"

export default reducer

type ReducerState = State["ui"]["additionalLaneCategory"]
type Action = SetAdditionalLaneCategory
const defaultState: ReducerState = localStorage.getItem("group_by") as any || "NONE"


function reducer(state = defaultState, action: Action): ReducerState {
    switch (action.type) {
        case "SET_ADDITIONAL_LANE_CATEGORY": return action.payload.category
        default: return state
    }
}
