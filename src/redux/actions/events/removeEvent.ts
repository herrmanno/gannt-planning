import { Action } from "redux"
import { addUndoActionByID } from "../dataHistory/addUndoAction"

export default removeEvent
export { RemoveEvent, REMOVE_EVENT }


const REMOVE_EVENT = "REMOVE_EVENT"

interface RemoveEvent extends Action {
    type: typeof REMOVE_EVENT
    payload: {
        id: string
    }
}

function removeEvent(id: string) {
    return (dispatch: Function) => {
        dispatch(addUndoActionByID(id))
        dispatch({
            type: REMOVE_EVENT,
            payload: { id }
        } as RemoveEvent)
    }
}
