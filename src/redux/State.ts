export default State

import Event from "./../Event"

type State = {
    data: {
        // TODO: refactor to { ids: string[], data: { [id: string]: Data } }
        events: Event[]
        users: { id: string, name: string }[]
    }
    ui: {
        startDate: Date
        numDays: number
        cellWidth: number
        rowHeight: number
    }
}
