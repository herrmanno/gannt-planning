import { createSelector } from "reselect"
import selectEvents from "./selectEvents"

export default createSelector(
    selectEvents,
    events => events.filter(Boolean).map(e => e!).filter(e => e._state !== "removed")
)