import { combineReducers } from "redux"
import startDate from "./startDate"
import numDays from "./numDays"
import cellWidth from "./cellWidth"
import rowHeight from "./rowHeight"
import additionalLaneCategory from "./additionalLaneCategory"
import selectedEventID from "./selectedEventID"

export default combineReducers({
    selectedEventID,
    startDate,
    numDays,
    cellWidth,
    rowHeight,
    additionalLaneCategory,
})