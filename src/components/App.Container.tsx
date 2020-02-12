import { ReduxContainer } from "react-class-container"
import { startOfWeek, addDays, isWithinInterval } from "date-fns"
import App from "./App"
import buildData from "../util/buildData"
import getRowOfItem from "../util/getRowOfItem"
import ReduxState from "../redux/State"
import loadEvents from "../redux/actions/events/loadEvents"
import createEvent from "../redux/actions/events/createEvent"
import moveEvents from "../redux/actions/events/moveEvents"
import scaleEvents from "../redux/actions/events/scaleEvents"
import { ThunkDispatch } from "redux-thunk"

type State = {
    startDate: Date
    numDays: number
    cellWidth: number
    rowHeight: number
    cursorDate: Date
    cursorRow: number
    // parsedData: Data[]
    // data: Data[][]
    selectedItemIDs: string[]
    dragging?: { id: string, startX: number, handle?: "left" | "right", startDate?: Date }
}

export default class AppContainer extends ReduxContainer(App)<ReduxState, {}, State> {
    state: State = {
        startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
        numDays: 28,
        cellWidth: 0,
        rowHeight: 40,
        cursorDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
        cursorRow: 0,
        // parsedData: [],
        // data: [],
        selectedItemIDs: [],
    }

    componentDidMount() {
        // const parsedData = parseData(data)
        this.setState({
            cellWidth: ~~(document.body.clientWidth / this.state.numDays),
            // parsedData,
            // data: buildData(parsedData),
        }, this.updateSelectedItems)
        document.addEventListener("keydown", this.onKeyDown)

        this.store.dispatch(loadEvents())
    }

    onKeyDown = async (e: KeyboardEvent) => {
        if (e.shiftKey) {
            if (e.keyCode === 37) {
                this.setState(s => ({ startDate: addDays(s.startDate, -7) }))
            } else if (e.keyCode === 39) {
                this.setState(s => ({ startDate: addDays(s.startDate, 7) }))
            } else if (e.keyCode === 38) {
                this.setState(s => ({
                    numDays: s.numDays + 7,
                    cellWidth: ~~(document.body.clientWidth / (s.numDays + 7)),
                }))
            } else if (e.keyCode === 40) {
                this.setState(s => ({
                    numDays: s.numDays - 7,
                    cellWidth: ~~(document.body.clientWidth / (s.numDays - 7)),
                }))
            }
        } else if (e.metaKey) {
            if (e.keyCode === 37) {
                e.preventDefault()
                await this.store.dispatch(moveEvents({ ids: this.state.selectedItemIDs, amount: -1 }))
                this.setState({
                    // parsedData,
                    // data: buildData(parsedData),
                    cursorDate: addDays(this.state.cursorDate, -1)
                })
            } else if (e.keyCode === 39) {
                e.preventDefault()
                await this.store.dispatch(moveEvents({ ids: this.state.selectedItemIDs, amount: 1 }))
                this.setState({
                    // parsedData,
                    // data: buildData(parsedData),
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

    onMouseMove = async (e: MouseEvent) => {
        // const { parsedData } = this.state
        const dragging = { ...this.state.dragging }
        const xDiff = ~~((e.clientX - dragging!.startX) / this.state.cellWidth)

        if (xDiff !== 0) {
            if (!dragging.id) {
                const event: any = await this.store.dispatch(createEvent({
                    start: dragging.startDate,
                    end: addDays(dragging.startDate, 1),
                    title: "BAZ",
                    color: "pink",
                }))
                dragging.id = event.id
                dragging.handle = xDiff > 0 ? "right" : "left"
                this.setState({
                    dragging,
                    // parsedData: parsedData,
                    // data: buildData(parsedData),
                })
            } else {
                if (!this.state.dragging.handle) {
                    await this.store.dispatch(moveEvents({ ids: [dragging.id], amount: xDiff }) as any)
                    this.setState({
                        dragging: {
                            ...dragging,
                            startX: dragging.startX + xDiff * this.state.cellWidth
                        },
                        // parsedData: newParsedData,
                        // data: buildData(newParsedData, { id: dragging.id, row: getRowOfItem(dragging.id, this.state.data) }),
                    })
                } else {
                    await this.store.dispatch(scaleEvents({ ids: [dragging.id], amount: xDiff, direction: dragging.handle }) as any)
                    this.setState({
                        dragging: {
                            ...dragging,
                            startX: dragging.startX + xDiff * this.state.cellWidth
                        },
                        // parsedData: newParsedData,
                        // data: buildData(newParsedData, { id: dragging.id, row: getRowOfItem(dragging.id, this.state.data) }),
                    })
                }
            }
        }
    }

    onMouseUp = () => {
        this.setState({
            dragging: null,
            // data: buildData(this.state.parsedData),
        })

        document.removeEventListener("mousemove", this.onMouseMove)
        document.removeEventListener("mouseup", this.onMouseUp)
    }

    updateSelectedItems = () => {
        const items = buildData(this.store.getState().data.events)[this.state.cursorRow] || []
        const ids = items
            .filter(item => isWithinInterval(this.state.cursorDate, { start: item.start, end: addDays(item.end, -1) }))
            .map(item => item.id)
        this.setState({ selectedItemIDs: ids })
    }

    getChildProps(_props, state: State, reduxState: ReduxState) {
        const eventsArray = reduxState.data.events
        return {
            ...state,
            parsedData: eventsArray,
            data: buildData(
                eventsArray,
                state.dragging
                    ? { id: state.dragging.id, row: getRowOfItem(state.dragging.id, this.lastChildProps.data) }
                    : undefined),
            onMouseDown: this.onMouseDown,
        }
    }
}

// function moveItems(ids: string[], amount: number, data: Data[]): Data[] {
//     return data.slice().map(item => {
//         if (ids.includes(item.id)) {
//             return {
//                 ...item,
//                 start: addDays(item.start, amount),
//                 end: addDays(item.end, amount),
//             }
//         } else {
//             return item
//         }
//     }).sort((a, b) => {
//         return compareAsc(a.start, b.start)
//     })
// }

// function scaleItems(ids: string[], amount: number, direction: "left" | "right", data: Data[]): Data[] {
//     return data.slice().map(item => {
//         if (ids.includes(item.id)) {
//             return {
//                 ...item,
//                 start: direction === "left" ? addDays(item.start, amount) : item.start,
//                 end: direction === "right" ? addDays(item.end, amount) : item.end,
//             }
//         } else {
//             return item
//         }
//     }).sort((a, b) => {
//         return compareAsc(a.start, b.start)
//     })
// }
