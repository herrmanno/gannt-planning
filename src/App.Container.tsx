import { Container } from "react-class-container"
import { parse, startOfWeek, addDays, compareAsc, isWithinInterval, areIntervalsOverlapping } from "date-fns"
import App from "./App"
import data, { RawData, Data } from "./data"

type State = {
    startDate: Date
    numDays: number
    cellWidth: number
    rowHeight: number
    cursorDate: Date
    cursorRow: number
    parsedData: Data[]
    data: Data[][]
    selectedItemIDs: string[]
    dragging?: { id: string, startX: number, handle?: "left" | "right", startDate?: Date }
}

export default class AppContainer extends Container(App)<{}, State> {
    state: State = {
        startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
        numDays: 28,
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
            } else if (e.keyCode === 38) {
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

    onMouseDown = (e: React.DragEvent) => {
        this.setState({
            dragging: {
                id: (e.currentTarget as HTMLElement).dataset["itemid"],
                handle: (e.target as HTMLElement).dataset["handle"] as any,
                startX: e.clientX,
                startDate: new Date((e.currentTarget as HTMLElement).dataset["date"])
            }
        })

        document.addEventListener("mousemove", this.onMouseMove)
        document.addEventListener("mouseup", this.onMouseUp)
    }

    onMouseMove = (e: MouseEvent) => {
        const { parsedData } = this.state
        const dragging = { ...this.state.dragging }
        const xDiff = ~~((e.clientX - dragging!.startX) / this.state.cellWidth)

        if (xDiff !== 0) {
            if (!dragging.id) {
                const id = dragging.id = Math.random().toString(36)
                dragging.handle = "right"
                parsedData.push({
                    id,
                    start: dragging.startDate,
                    end: addDays(dragging.startDate, 1),
                    title: "BAZ",
                    color: "pink",
                })
                this.setState({
                    dragging,
                    parsedData: parsedData,
                    data: buildData(parsedData),
                })
            } else {
                if (!this.state.dragging.handle) {
                    const newParsedData = moveItems([dragging.id], xDiff, parsedData)
                    this.setState({
                        dragging: {
                            ...dragging,
                            startX: dragging.startX + xDiff * this.state.cellWidth
                        },
                        parsedData: newParsedData,
                        data: buildData(newParsedData, { id: dragging.id, row: getRowOfItem(dragging.id, this.state.data)}),
                    })
                } else {
                    const newParsedData = scaleItems([dragging.id], xDiff, dragging.handle, parsedData)
                    this.setState({
                        dragging: {
                            ...dragging,
                            startX: dragging.startX + xDiff * this.state.cellWidth
                        },
                        parsedData: newParsedData,
                        data: buildData(newParsedData, { id: dragging.id, row: getRowOfItem(dragging.id, this.state.data)}),
                    })
                }
            }
        }
    }

    onMouseUp = () => {
        this.setState({
            dragging: null,
            data: buildData(this.state.parsedData),
        })

        document.removeEventListener("mousemove", this.onMouseMove)
        document.removeEventListener("mouseup", this.onMouseUp)
    }

    updateSelectedItems = () => {
        const items = this.state.data[this.state.cursorRow]
        const ids = items
            .filter(item => isWithinInterval(this.state.cursorDate, { start: item.start, end: addDays(item.end, -1) }))
            .map(item => item.id)
        this.setState({ selectedItemIDs: ids })
    }

    getChildProps(_props, state) {
        return {
            ...state,
            onMouseDown: this.onMouseDown,
        }
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

function scaleItems(ids: string[], amount: number, direction: "left" | "right", data: Data[]): Data[] {
    return data.slice().map(item => {
        if (ids.includes(item.id)) {
            return {
                ...item,
                start: direction === "left" ? addDays(item.start, amount) : item.start,
                end: direction === "right" ? addDays(item.end, amount) : item.end,
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

function buildData(data: Data[], fixedItem: { id: string, row: number } = { id: null, row: null }): Data[][] {
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

function getRowOfItem(id: string, data: Data[][]): number {
    return data.findIndex(row => row.some(item => item.id === id))
}