import { Action } from "redux"

export default loadUsers
export { LoadUsers, LOAD_USERS }


const LOAD_USERS = "LOAD_USERS"

interface LoadUsers extends Action {
    type: typeof LOAD_USERS
    payload: {
        users: { id: string, name: string }[]
    }
}

function loadUsers(): any {
    return async (dispatch: Function) => {
        const res = await fetch("http://localhost:8080/api/users")
        const events = await res.json()

        dispatch({
            type: LOAD_USERS,
            payload: { users: events }
        } as LoadUsers)
    }
}
