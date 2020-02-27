import { areIntervalsOverlapping, addDays, compareAsc } from "date-fns"
import Event from "../Event"

export default buildData

function buildData<T extends Event>(data: T[], fixedItem: { id: string, row: number } = { id: null, row: null }): T[][] {
    const rows = data
        .sort((a, b) => compareAsc(a.start, b.start))
        .reduce((acc, item) => {
            const rowIndexToInsert = acc.findIndex((row, idx) => {
                const intervals = [
                    ...row,
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
                    return intervals.every(interval => {
                        return !areIntervalsOverlapping(
                            { ...item, end: addDays(item.end, 1) },
                            { ...interval, end: addDays(interval.end, 1) }
                        )
                    })
                }
            })
            if (rowIndexToInsert !== -1) {
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
        }, new Array<T[]>([]))

    return rows.filter(row => row.length)
}