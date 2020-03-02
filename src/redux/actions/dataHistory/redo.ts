import { Action } from "redux"
import ReduxState from "../../State"
import Event from "../../../Event"
import { addUndoActionByID } from "./addUndoAction"

export default redo
export { Redo, REDO }


const REDO = "REDO"

interface Redo extends Action {
    type: typeof REDO
    payload: {
        id: string
        event?: Event & { _state: any }
    }
}

function redo() {
    return (dispatch: Function, getState: () => ReduxState) => {
        const redos = getState().dataHistory.redo
        if (redos.length) {
            const { id, event } = redos[0]

            dispatch(addUndoActionByID(id))

            dispatch({
                type: REDO,
                payload: { id, event }
            } as Redo)
        }
    }
}
