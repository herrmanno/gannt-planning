import { Action } from "redux"
import Event from "../../../Event"
import { addDays } from "date-fns"
import State from "../../State"
import { addUndoActionByID } from "../dataHistory/addUndoAction"

export { moveEventByID, MoveEvent, MOVE_EVENT }


const MOVE_EVENT = "MOVE_EVENT"

interface MoveEvent extends Action {
    type: typeof MOVE_EVENT
    payload: {
        event: Event
    }
}

type Args = {
    id: string
    amount: number
}

function moveEventByID(args: Args): any {
    return (dispatch: Function, getState: () => State) => {
        if (args.amount !== 0) {
            const { id, amount } = args
            const { start, end, ...data } = getState().data.events[id]
            const event = {
                ...data,
                start: addDays(start, amount),
                end: addDays(end, amount),
            }

            dispatch(addUndoActionByID(id))

            dispatch({
                type: MOVE_EVENT,
                payload: { event }
            } as MoveEvent)
        }
    }
}
