import { Action } from "redux"
import Event from "../../../Event"
import { addDays } from "date-fns"
import State from "../../State"
import { addUndoActionByID } from "../dataHistory/addUndoAction"

export { scaleEventByID, ScaleEvent, SCALE_EVENT }


const SCALE_EVENT = "SCALE_EVENT"

interface ScaleEvent extends Action {
    type: typeof SCALE_EVENT
    payload: {
        event: Event
    }
}

type Args = {
    id: string
    amount: number
    direction?: "left" | "right"
}

function scaleEventByID(args: Args): any {
    return (dispatch: Function, getState: () => State) => {
        const { id, amount, direction } = args
        const { start, end, ...data } = getState().data.events[id]

        const event = {
            ...data,
            start: direction === "left" ? addDays(start, amount) : start,
            end: direction === "right" ? addDays(end, amount) : end,
        }

        dispatch(addUndoActionByID(id))

        dispatch({
            type: SCALE_EVENT,
            payload: { event }
        } as ScaleEvent)
    }
}
