export default State

import Event from "./../Event"
import User from "../User"
import Project from "../Project"

type State = {
    data: {
        // TODO: refactor to { ids: string[], data: { [id: string]: Data } }
        events: Event[]
        users: User[]
        projects: Project[]
    }
    ui: {
        startDate: Date
        numDays: number
        cellWidth: number
        rowHeight: number

        additionalLaneCategory: "NONE" | "BY_PROJECT" | "BY_USER"
    }
}
