import { Action } from "redux"
import ReduxState from "../../State"
import Event from "../../../Event"

export { addRedoActionByID, AddRedoAction, ADD_REDO_ACTION }


const ADD_REDO_ACTION = "ADD_REDO_ACTION"

interface AddRedoAction extends Action {
    type: typeof ADD_REDO_ACTION
    payload: {
        id: string
        event?: Event & { _state?: any }
    }
}

function addRedoAction(id: string, event?: Event & { _state?: any }): AddRedoAction {
    return {
        type: ADD_REDO_ACTION,
        payload: {
            id,
            event,
        }
    }
}

function addRedoActionByID(id: string) {
    return (dispatch: Function, getState: () => ReduxState) => {
        const event = getState().data.events[id] || null
        dispatch(addRedoAction(id, event))
    }
}
