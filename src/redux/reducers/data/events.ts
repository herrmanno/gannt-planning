import State from "../../State"
import { LoadEvents } from "../../actions/events/loadEvents"
import { MoveEvents } from "../../actions/events/moveEvents"
import { ScaleEvents } from "../../actions/events/scaleEvents"
import { CreateEvent } from "../../actions/events/createEvent"
import parseData from "../../../util/parseData"
import { PatchEvent } from "../../actions/events/patchEvent"

export default reducer

type ReducerState = State["data"]["events"]
// TODO: handle commit
type Action = LoadEvents | CreateEvent | PatchEvent | MoveEvents | ScaleEvents
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
        case "PATCH_EVENT":
            return [
                ...state.filter(e => e.id !== action.payload.data.id),
                { ...state.find(e => e.id === action.payload.data.id), ...action.payload.data }
            ]
        case "MOVE_EVENTS": {
            return action.payload.events
        }
        case "SCALE_EVENTS": {
            return action.payload.events
        }
        default: return state
    }
}
