import { Action } from "redux"
import { Data } from "../../../data"

export default moveEvents
export { CreateEvent, CREATE_EVENT }


const CREATE_EVENT = "CREATE_EVENT"

interface CreateEvent extends Action {
    type: typeof CREATE_EVENT
    payload: {
        event: Data
    }
}

function moveEvents(data: Partial<Data>): any {
    return async (dispatch: Function) => {
        const event: Data = {
            title: "Foo",
            color: "red",
            start: null,
            end: null,
            ...data,
            id: Math.random().toString(36),
        }

        dispatch({
            type: CREATE_EVENT,
            payload: { event },
        } as CreateEvent)

        return event
    }
}
