import { createSelector } from "reselect"
import State from "../State"

export default createSelector(
    (s: State) => s.data.events,
    events => events.filter(e => e._state !== "removed")
)