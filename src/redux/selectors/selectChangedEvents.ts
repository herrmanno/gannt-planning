import { createSelector } from "reselect"
import selectEvents from "./selectEvents"

export default createSelector(
    selectEvents,
    events => events.filter(e => !!e._state)
)