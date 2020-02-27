import { Action } from "redux"
import Event from "../../../Event"
import { addDays, compareAsc } from "date-fns"
import State from "../../State"

export default scaleEvents
export { ScaleEvents, SCALE_EVENTS }


const SCALE_EVENTS = "SCALE_EVENTS"

interface ScaleEvents extends Action {
    type: typeof SCALE_EVENTS
    payload: {
        events: Event[]
    }
}

type Args = {
    ids: string[]
    amount: number
    direction?: "left" | "right"
}

function scaleEvents(args: Args): any {
    return (dispatch: Function, getState: () => State) => {
        const { ids, amount, direction } = args
        const data = getState().data.events

        const events = data.filter(item => ids.includes(item.id)).map(item => {
            return {
                ...item,
                start: direction === "left" ? addDays(item.start, amount) : item.start,
                end: direction === "right" ? addDays(item.end, amount) : item.end,
            }
        }).sort((a, b) => {
            return compareAsc(a.start, b.start)
        })

        dispatch({
            type: SCALE_EVENTS,
            payload: { events }
        } as ScaleEvents)
    }
}
