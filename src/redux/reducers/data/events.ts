import State from "../../State"
import parseData from "../../../util/parseData"
import { LoadEvents } from "../../actions/events/loadEvents"
import { MoveEvent } from "../../actions/events/moveEvent"
import { ScaleEvent } from "../../actions/events/scaleEvent"
import { CreateEvent } from "../../actions/events/createEvent"
import { PatchEvent } from "../../actions/events/patchEvent"
import { RemoveEvent } from "../../actions/events/removeEvent"
import { CommitEvents } from "../../actions/events/commitEvents"
import { Undo } from "../../actions/dataHistory/undo"
import Event from "../../../Event"
import { Redo } from "../../actions/dataHistory/redo"

export default reducer

type ReducerState = State["data"]["events"]

type Action =
    LoadEvents |
    CreateEvent |
    PatchEvent |
    RemoveEvent |
    MoveEvent |
    ScaleEvent |
    CommitEvents |
    Undo |
    Redo

const defaultState: ReducerState = {}


function reducer(state = defaultState, action: Action): ReducerState {
    switch (action.type) {
        case "LOAD_EVENTS": {
            const parsedData = parseData(action.payload.events)
            return parsedData.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})
        }
        case "CREATE_EVENT": {
            return {
                ...state,
                [action.payload.event.id]: updateEventState("new")(action.payload.event)
            }
        }
        case "REMOVE_EVENT": {
            const { id } = action.payload
            if (state[id]._state === "new") {
                return { ...state, [id]: null }
            } else {
                return { ...state, [id]: updateEventState("removed")(state[id]) }
            }
        }
        case "PATCH_EVENT":
            return {
                ...state,
                [action.payload.data.id]: updateEventState("modified")({
                    ...state[action.payload.data.id],
                    ...action.payload.data
                })
            }
        case "MOVE_EVENT": {
            return {
                ...state,
                [action.payload.event.id]: updateEventState("modified")(action.payload.event)
            }
        }
        case "SCALE_EVENT": {
            return {
                ...state,
                [action.payload.event.id]: updateEventState("modified")(action.payload.event)
            }
        }
        case "COMMIT_EVENTS": {
            return Object.keys(state)
                .map(id => state[id])
                .filter(Boolean)
                .filter(event => event._state !== "removed")
                .map(({ _state, ...event }) => event)
                .reduce((acc, item) => ({ ...acc, [item.id]: item }), {})
        }
        case "UNDO":
        case "REDO": {
            return {
                ...state,
                [action.payload.id]: action.payload.event
            }
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
