import { Action } from "redux"
import Event from "../../../Event"
import { addUndoActionByID } from "../dataHistory/addUndoAction"

export default patchEvent
export { PatchEvent, PATCH_EVENT }


const PATCH_EVENT = "PATCH_EVENT"

interface PatchEvent extends Action {
    type: typeof PATCH_EVENT
    payload: {
        data: Event
    }
}

function patchEvent(data: Partial<Event>): any {
    return async (dispatch: Function) => {
        dispatch(addUndoActionByID(data.id))
        dispatch({
            type: PATCH_EVENT,
            payload: { data },
        } as PatchEvent)
    }
}
