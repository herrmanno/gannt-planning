import { Action } from "redux"
import { Data } from "../../../data"

export default patchEvent
export { PatchEvent, PATCH_EVENT }


const PATCH_EVENT = "PATCH_EVENT"

interface PatchEvent extends Action {
    type: typeof PATCH_EVENT
    payload: {
        data: Data
    }
}

function patchEvent(data: Partial<Data>): any {
    return async (dispatch: Function) => {
        dispatch({
            type: PATCH_EVENT,
            payload: { data },
        } as PatchEvent)
    }
}
