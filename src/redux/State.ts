export default State

import Event from "./../Event"
import User from "../User"
import Project from "../Project"

type State = {
    data: {
        // TODO: refactor to { ids: string[], data: { [id: string]: Data } }
        events: { [id: string]: (Event & { _state?: "new" | "modified" | "removed" }) }
        users: { [id: string]: User }
        projects: { [id: string]: Project },
    }
    dataHistory: {
        undo: { id: string, event?: (Event & { _state?: "new" | "modified" | "removed" }), date: number }[]
        redo: { id: string, event?: (Event & { _state?: "new" | "modified" | "removed" }) }[]
    }
    ui: {
        selectedEventID?: string
        startDate: Date
        numDays: number
        cellWidth: number
        rowHeight: number

        additionalLaneCategory: "NONE" | "BY_PROJECT" | "BY_USER"
        autoSave: boolean
    }
}
