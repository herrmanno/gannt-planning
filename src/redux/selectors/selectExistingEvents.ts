import { createSelector } from "reselect"
import selectEvents from "./selectEvents"

export default createSelector(
    selectEvents,
    events => events.filter(Boolean).filter(e => e._state !== "removed")
)