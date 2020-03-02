import { createSelector } from "reselect"
import State from "../State"

export default createSelector(
    (s: State) => s.data.users,
    users => Object.keys(users).map(id => users[id]).filter(Boolean)
)