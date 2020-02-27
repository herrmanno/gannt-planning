import { Action } from "redux"
import User from "../../../User"

export default loadUsers
export { LoadUsers, LOAD_USERS }


const LOAD_USERS = "LOAD_USERS"

interface LoadUsers extends Action {
    type: typeof LOAD_USERS
    payload: {
        users: User[]
    }
}

function loadUsers(): any {
    return async (dispatch: Function) => {
        const res = await fetch(`${process.env.SERVER_URL}/api/users`)
        const users = await res.json()

        dispatch({
            type: LOAD_USERS,
            payload: { users }
        } as LoadUsers)
    }
}
