import { Action } from "redux"

export default setAutoSave

export { SetAutoSave, SET_AUTO_SAVE }

const SET_AUTO_SAVE = "SET_AUTO_SAVE"

interface SetAutoSave extends Action {
    type: typeof SET_AUTO_SAVE
    payload: {
        autoSave: boolean
    }
}

function setAutoSave(autoSave: boolean): SetAutoSave {
    localStorage.setItem("autoSave", String(autoSave))
    return {
        type: SET_AUTO_SAVE,
        payload: { autoSave }
    }
}