import { Action } from "redux"
import Event from "../../../Event"
import { addDays, compareAsc } from "date-fns"
import State from "../../State"

export default moveEvents
export { MoveEvents, MOVE_EVENTS }


const MOVE_EVENTS = "MOVE_EVENTS"

interface MoveEvents extends Action {
    type: typeof MOVE_EVENTS
    payload: {
        events: Event[]
    }
}

type Args = {
    ids: string[]
    amount: number
}

function moveEvents(args: Args): any {
    return (dispatch: Function, getState: () => State) => {
        const { ids, amount } = args
        const data = getState().data.events

        const events = data.filter(item => ids.includes(item.id)).map(item => {
            return {
                ...item,
                start: addDays(item.start, amount),
                end: addDays(item.end, amount),
            }
        }).sort((a, b) => {
            return compareAsc(a.start, b.start)
        })

        dispatch({
            type: MOVE_EVENTS,
            payload: { events }
        } as MoveEvents)
    }
}
