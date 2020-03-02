import { combineReducers } from "redux"
import data from "./data"
import dataHistory from "./dataHistory"
import ui from "./ui"

export default combineReducers({
    data,
    dataHistory,
    ui,
})