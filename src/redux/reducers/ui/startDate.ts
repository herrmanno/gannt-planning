import State from "../../State"
import { startOfWeek, addWeeks } from "date-fns"
import { SetStartDate } from "../../actions/ui/setStartDate"

export default reducer


type ReducerState = State["ui"]["startDate"]
type Action = SetStartDate
const defaultState: ReducerState = startOfWeek(addWeeks(new Date(), -1), { weekStartsOn: 1 })


function reducer(state = defaultState, action: Action): ReducerState {
    switch (action.type) {
        case "SET_STARTDATE": return action.payload.startDate
        default: return state
    }
}
