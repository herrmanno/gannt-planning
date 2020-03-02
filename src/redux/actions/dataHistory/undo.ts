import { Action } from "redux"
import ReduxState from "../../State"
import Event from "../../../Event"
import { addRedoActionByID } from "./addRedoAction"

export default undo
export { Undo, UNDO }


const UNDO = "UNDO"

interface Undo extends Action {
    type: typeof UNDO
    payload: {
        id: string
        event?: Event & { _state: any }
    }
}

function undo() {
    return (dispatch: Function, getState: () => ReduxState) => {
        const undos = getState().dataHistory.undo
        if (undos.length) {
            const { id, event } = undos[0]

            dispatch(addRedoActionByID(id))

            dispatch({
                type: UNDO,
                payload: { id, event }
            } as Undo)
        }
    }
}
