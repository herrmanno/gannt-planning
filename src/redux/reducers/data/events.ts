import State from "../../State"
import parseData from "../../../util/parseData"
import { LoadEvents } from "../../actions/events/loadEvents"
import { MoveEvents } from "../../actions/events/moveEvents"
import { ScaleEvents } from "../../actions/events/scaleEvents"
import { CreateEvent } from "../../actions/events/createEvent"
import { PatchEvent } from "../../actions/events/patchEvent"
import { RemoveEvent } from "../../actions/events/removeEvent"

export default reducer

type ReducerState = State["data"]["events"]
// TODO: handle commit
type Action = LoadEvents | CreateEvent | PatchEvent | RemoveEvent | MoveEvents | ScaleEvents
const defaultState: ReducerState = []


function reducer(state = defaultState, action: Action): ReducerState {
    switch (action.type) {
        case "LOAD_EVENTS": {
            const parsedData = parseData(action.payload.events)
            return parsedData
        }
        case "CREATE_EVENT": {
            console.dir([...state, action.payload.event])
            return [...state, action.payload.event]
        }
        case "REMOVE_EVENT": {
            return state.filter(event => event.id !== action.payload.id)
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
