import { Action } from "redux"
import ReduxState from "../../State"
import Event from "../../../Event"

export default addUndoAction
export { addUndoActionByID, AddUndoAction, ADD_UNDO_ACTION }


const ADD_UNDO_ACTION = "ADD_UNDO_ACTION"

interface AddUndoAction extends Action {
    type: typeof ADD_UNDO_ACTION
    payload: {
        id: string
        event?: Event & { _state?: any }
        date: number
    }
}

function addUndoAction(id: string, event?: Event & { _state?: any }): AddUndoAction {
    return {
        type: ADD_UNDO_ACTION,
        payload: {
            id,
            event,
            date: Date.now(),
        }
    }
}

function addUndoActionByID(id: string) {
    return (dispatch: Function, getState: () => ReduxState) => {
        const event = getState().data.events[id] || null
        dispatch(addUndoAction(id, event))
    }
}
