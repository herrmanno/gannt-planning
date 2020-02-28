import { Action } from "redux"

export default selectEvent

export { SelectEvent, SELECT_EVENT }

const SELECT_EVENT = "SELECT_EVENT"

interface SelectEvent extends Action {
    type: typeof SELECT_EVENT
    payload: {
        id: string
    }
}

function selectEvent(id: string): SelectEvent {
    return {
        type: SELECT_EVENT,
        payload: { id }
    }
}