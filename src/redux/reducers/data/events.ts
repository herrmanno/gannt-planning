import State from "../../State"
import parseData from "../../../util/parseData"
import { LoadEvents } from "../../actions/events/loadEvents"
import { MoveEvents } from "../../actions/events/moveEvents"
import { ScaleEvents } from "../../actions/events/scaleEvents"
import { CreateEvent } from "../../actions/events/createEvent"
import { PatchEvent } from "../../actions/events/patchEvent"
import { RemoveEvent } from "../../actions/events/removeEvent"
import { CommitEvents } from "../../actions/events/commitEvents"
import Event from "../../../Event"

export default reducer

type ReducerState = State["data"]["events"]
// TODO: handle commit
type Action = LoadEvents | CreateEvent | PatchEvent | RemoveEvent | MoveEvents | ScaleEvents | CommitEvents
const defaultState: ReducerState = []


function reducer(state = defaultState, action: Action): ReducerState {
    switch (action.type) {
        case "LOAD_EVENTS": {
            const parsedData = parseData(action.payload.events)
            return parsedData
        }
        case "CREATE_EVENT": {
            return [...state, updateEventState("new")(action.payload.event)]
        }
        case "REMOVE_EVENT": {
            return state
                .filter(event => !(event.id === action.payload.id && event._state === "new"))
                .map(event => {
                    if (event.id === action.payload.id) {
                        return updateEventState("removed")(event)
                    } else {
                        return event
                    }
                })
        }
        case "PATCH_EVENT":
            return [
                ...state.filter(e => e.id !== action.payload.data.id),
                updateEventState("modified")({
                    ...state.find(e => e.id === action.payload.data.id),
                    ...action.payload.data
                })
            ]
        case "MOVE_EVENTS": {
            return [
                ...state.filter(item => !action.payload.events.find(item2 => item.id === item2.id)),
                ...action.payload.events.map(updateEventState("modified")),
            ]
        }
        case "SCALE_EVENTS": {
            return [
                ...state.filter(item => !action.payload.events.find(item2 => item.id === item2.id)),
                ...action.payload.events.map(updateEventState("modified")),
            ]
        }
        case "COMMIT_EVENTS": {
            return state.map(({ _state, ...event }) => event)
        }
        default: return state
    }
}

function updateEventState(state: "new" | "modified" | "removed") {
    return function (event: Event & { _state?: string }) {
        const _state = event._state === "new" || event._state === "removed"
            ? event._state
            : state
        return { ...event, _state }
    }
}
