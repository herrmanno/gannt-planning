import { createSelector } from "reselect"
import State from "../State"

export default createSelector(
    (s: State) => s.data.projects,
    projects => Object.keys(projects).map(id => projects[id]).filter(Boolean)
)