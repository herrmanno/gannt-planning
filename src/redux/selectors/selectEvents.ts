import { createSelector } from "reselect"
import State from "../State"

export default createSelector(
    (s: State) => s.data.events,
    events => Object.keys(events).map(id => events[id]).filter(Boolean)
)