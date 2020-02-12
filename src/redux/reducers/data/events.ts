import State from "../../State"
import { LoadEvents } from "../../actions/events/loadEvents"
import { MoveEvents } from "../../actions/events/moveEvents"
import { ScaleEvents } from "../../actions/events/scaleEvents"
import { CreateEvent } from "../../actions/events/createEvent"
import parseData from "../../../util/parseData"

export default reducer

type ReducerState = State["data"]["events"]
type Action = LoadEvents | CreateEvent | MoveEvents | ScaleEvents
const defaultState: ReducerState = []


function reducer(state = defaultState, action: Action): ReducerState {
    switch (action.type) {
        case "LOAD_EVENTS": {
            const parsedData = parseData(action.payload.events)
            return parsedData
        }
        case "CREATE_EVENT": {
            return [...state, action.payload.event]
        }
        case "MOVE_EVENTS": {
            return action.payload.events
        }
        case "SCALE_EVENTS": {
            return action.payload.events
        }
        default: return state
    }
}
