import { Action } from "redux"
import ReduxState from "../../State"

export default setNumDays

export { SetNumDays, SET_NUMDAYS }

const SET_NUMDAYS = "SET_NUMDAYS"

interface SetNumDays extends Action {
    type: typeof SET_NUMDAYS
    payload: {
        numDays: number
    }
}

function setNumDays(modify: (number) => number): any {
    return (dispatch: Function, getState: () => ReduxState) => {
        const numDays = Math.max(7, modify(getState().ui.numDays))
        dispatch({
            type: SET_NUMDAYS,
            payload: { numDays }
        } as SetNumDays)
    }
}