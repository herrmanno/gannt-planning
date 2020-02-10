import { Container } from "react-class-container"
import { parse, startOfWeek, addDays, compareAsc, isWithinInterval } from "date-fns"
import App from "./App"
import data, { RawData, Data } from "./data"

export default class AppContainer extends Container(App) {
    state = {
        startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
        numDays: 21,
        cellWidth: 0,
        rowHeight: 40,
        cursorDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
        cursorRow: 0,
        parsedData: [],
        data: [],
        selectedItemIDs: [],
    }

    componentDidMount() {
        const parsedData = parseData(data)
        this.setState({
            cellWidth: ~~(document.body.clientWidth / this.state.numDays),
            parsedData,
            data: buildData(parsedData),
        }, this.updateSelectedItems)
        document.addEventListener("keydown", this.onKeyDown)
    }

    onKeyDown = (e: KeyboardEvent) => {
        if (e.metaKey) {
            if (e.keyCode === 37) {
                e.preventDefault()
                const parsedData = moveItems(this.state.selectedItemIDs, -1, this.state.parsedData)
                this.setState({
                    parsedData,
                    data: buildData(parsedData),
                    cursorDate: addDays(this.state.cursorDate, -1)
                })
            } else if (e.keyCode === 39) {
                e.preventDefault()
                const parsedData = moveItems(this.state.selectedItemIDs, 1, this.state.parsedData)
                this.setState({
                    parsedData,
                    data: buildData(parsedData),
                    cursorDate: addDays(this.state.cursorDate, 1)
                })
            }
        } else {
            if (e.keyCode === 37) {
                this.setState({
                    cursorDate: addDays(this.state.cursorDate, -1)
                }, this.updateSelectedItems)
            } else if (e.keyCode === 39) {
                this.setState({
                    cursorDate: addDays(this.state.cursorDate, 1)
                }, this.updateSelectedItems)
            } else  if (e.keyCode === 38) {
                this.setState({
                    cursorRow: this.state.cursorRow - 1
                }, this.updateSelectedItems)
            } else if (e.keyCode === 40) {
                this.setState({
                    cursorRow: this.state.cursorRow + 1
                }, this.updateSelectedItems)
            }
        }
    }

    updateSelectedItems = () => {
        const items = this.state.data[this.state.cursorRow]
        const ids = items
            .filter(item => isWithinInterval(this.state.cursorDate, { start: item.start, end: addDays(item.end, -1)}))
            .map(item => item.id)
        this.setState({ selectedItemIDs: ids })
    }

}

function moveItems(ids: string[], amount: number, data: Data[]): Data[] {
    return data.slice().map(item => {
        if (ids.includes(item.id)) {
            return {
                ...item,
                start: addDays(item.start, amount),
                end: addDays(item.end, amount),
            }
        } else {
            return item
        }
    }).sort((a, b) => {
        return compareAsc(a.start, b.start)
    })
}

function parseData(data: RawData[]): Data[] {
    return data.map(o => ({
        ...o,
        start: parse(o.start, "yyyy-MM-dd", 0),
        end: parse(o.end, "yyyy-MM-dd", 0),
    })).sort((a, b) => {
        return compareAsc(a.start, b.start)
    })
}

function buildData(data: Data[]): Data[][] {
    const rows = data.reduce((acc, item) => {
        const rowIndexToInsert = acc.findIndex(row => {
            const lastItem = row.slice(-1)[0]
            return !lastItem || +lastItem.end <= +item.start
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
    }, new Array<Data[]>([]))

    return rows
}
