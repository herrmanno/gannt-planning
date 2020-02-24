import { parse, compareAsc } from "date-fns"
import Event, { SerializedEvent } from "../Event"

export default parseData

function parseData(data: SerializedEvent[]): Event[] {
    return data.map(o => ({
        ...o,
        start: parse(o.start, "yyyy-MM-dd", 0),
        end: parse(o.end, "yyyy-MM-dd", 0),
    })).sort((a, b) => {
        return compareAsc(a.start, b.start)
    })
}