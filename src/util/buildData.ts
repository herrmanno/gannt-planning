import { areIntervalsOverlapping } from "date-fns"
import Event from "../Event"

export default buildData

function buildData(data: Event[], fixedItem: { id: string, row: number } = { id: null, row: null }): Event[][] {
    const rows = data.reduce((acc, item) => {
        const rowIndexToInsert = acc.findIndex((row, idx) => {
            const intervals = [
                row.slice(-1)[0],
                (
                    fixedItem &&
                    item.id !== fixedItem.id &&
                    idx === fixedItem.row &&
                    data.find(item => item.id === fixedItem.id)
                )
            ].filter(Boolean)

            if (item.id === fixedItem.id) {
                return idx === fixedItem.row
            } else {
                return intervals.every(interval => !areIntervalsOverlapping(item, interval))
            }
        })
        if (rowIndexToInsert !== -1) {
            2
            return acc.map((row, idx) => {
                if (idx === rowIndexToInsert) {
                    return [...row, item]
                } else {
                    return row
                }
            })
        } else {
            return [...acc, [item]]
        }
    }, new Array<Event[]>([]))

    return rows.filter(row => row.length)
}