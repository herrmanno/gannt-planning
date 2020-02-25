import { combineReducers } from "redux"
import events from "./events"
import users from "./users"
import projects from "./projects"

export default combineReducers({
    events,
    users,
    projects,
})