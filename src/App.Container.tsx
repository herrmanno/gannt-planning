import { Container } from "react-class-container"
import { parse, startOfWeek, addDays, compareAsc, isWithinInterval } from "date-fns"
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
    dragging?: { id: string, startX: number, handle?: "left" | "right" }
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

    onDragStart = (e: React.DragEvent) => {
        this.setState({
            dragging: {
                id: (e.currentTarget as HTMLElement).dataset["itemid"],
                handle: (e.target as HTMLElement).dataset["handle"] as any,
                startX: e.clientX
            }
        })

        document.addEventListener("mousemove", this.onMouseMove)
        document.addEventListener("mouseup", this.onMouseUp)
    }

    onMouseMove = (e: MouseEvent) => {
        const xDiff = ~~((e.clientX - this.state.dragging!.startX) / this.state.cellWidth)

        if (xDiff !== 0) {
            if (!this.state.dragging!.handle) {
                const parsedData = moveItems([this.state.dragging!.id], xDiff, this.state.parsedData)
                this.setState({
                    dragging: {
                        ...this.state.dragging,
                        startX: this.state.dragging!.startX + xDiff * this.state.cellWidth
                    },
                    parsedData,
                    data: buildData(parsedData),
                })
            } else {
                const parsedData = scaleItems([this.state.dragging!.id], xDiff, this.state.dragging!.handle, this.state.parsedData)
                this.setState({
                    dragging: {
                        ...this.state.dragging,
                        startX: this.state.dragging!.startX + xDiff * this.state.cellWidth
                    },
                    parsedData,
                    data: buildData(parsedData),
                })
            }
        }
    }

    onMouseUp = () => {
        this.setState({
            dragging: null,
        })

        document.removeEventListener("mousemove", this.onMouseMove)
        document.removeEventListener("mouseup", this.onMouseUp)
    }

    updateSelectedItems = () => {
        const items = this.state.data[this.state.cursorRow]
        const ids = items
            .filter(item => isWithinInterval(this.state.cursorDate, { start: item.start, end: addDays(item.end, -1)}))
            .map(item => item.id)
        this.setState({ selectedItemIDs: ids })
    }

    getChildProps(props, state) {
        return {
            ...state,
            onDragStart: this.onDragStart,
            onDragEnd: this.onDragStart,
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

function scaleItems(ids: string[], amount: number, direction: "left" | "right", data: Data[]): Data[] {
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
