import { Action } from "redux"
import Event from "../../../Event"

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
        dispatch({
            type: PATCH_EVENT,
            payload: { data },
        } as PatchEvent)
    }
}
