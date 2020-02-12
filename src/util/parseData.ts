import { parse, compareAsc } from "date-fns"
import { RawData, Data } from "../data"

export default parseData

function parseData(data: RawData[]): Data[] {
    return data.map(o => ({
        ...o,
        start: parse(o.start, "yyyy-MM-dd", 0),
        end: parse(o.end, "yyyy-MM-dd", 0),
    })).sort((a, b) => {
        return compareAsc(a.start, b.start)
    })
}