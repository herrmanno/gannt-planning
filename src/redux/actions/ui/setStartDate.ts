import { Action } from "redux"
import ReduxState from "../../State"

export default setStartDate

export { SetStartDate, SET_STARTDATE }

const SET_STARTDATE = "SET_STARTDATE"

interface SetStartDate extends Action {
    type: typeof SET_STARTDATE
    payload: {
        startDate: Date
    }
}

function setStartDate(modify: (Date) => Date): any {
    return (dispatch: Function, getState: () => ReduxState) => {
        const startDate = modify(getState().ui.startDate)
        dispatch({
            type: SET_STARTDATE,
            payload: { startDate }
        } as SetStartDate)
    }
}