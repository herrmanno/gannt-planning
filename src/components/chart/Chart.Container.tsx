import { ReduxContainer } from "react-class-container"
import { startOfWeek, addDays, isWithinInterval, differenceInDays } from "date-fns"
import Chart from "./Chart"
import buildData from "../../util/buildData"
import ReduxState from "../../redux/State"
import createEvent from "../../redux/actions/events/createEvent"
import { moveEventByID } from "../../redux/actions/events/moveEvent"
import { scaleEventByID } from "../../redux/actions/events/scaleEvent"
import selectEvent from "../../redux/actions/ui/selectEvent"
import Event from "../../Event"
import selectExistingEvents from "../../redux/selectors/selectExistingEvents"
import selectUsers from "../../redux/selectors/selectUsers"
import selectProjects from "../../redux/selectors/selectProjects"

type Props = {
    title?: string
    filter?(data: Event): boolean
    onCreateEvent?(event: Partial<Event>): Partial<Event>
    preferedUserID?: string
}

type State = {
    cursorDate: Date
    cursorRow: number
    selectedItemIDs: string[]
    dragging?: {
        rowIndex: number
        id?: string
        startX: number
        handle?: "left" | "right"
        startDate?: Date
        startDateOffset?: number
        newItem: boolean
    }
}

export default class ChartContainer extends ReduxContainer(Chart)<ReduxState, Props, State> {
    state: State = {
        cursorDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
        cursorRow: 0,
        selectedItemIDs: [],
    }

    onMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0 /* left button */) {
            const { events } = this.store.getState().data
            const id = (e.target as HTMLElement).dataset["itemid"]
            const startDate = new Date((e.target as HTMLElement).dataset["date"]!)
            this.setState({
                dragging: {
                    id,
                    startDate,
                    startDateOffset: id ? differenceInDays(startDate, events[id]!.start) : undefined,
                    startX: e.clientX,
                    newItem: !id,
                    rowIndex: +(e.target as HTMLElement).dataset["rowIndex"]!,
                    handle: (e.target as HTMLElement).dataset["handle"] as any,
                }
            })

            document.addEventListener("mouseup", this.onMouseUp)
        }
    }

    onMouseEnter = async (e: React.MouseEvent) => {
        const { events } = this.store.getState().data
        const dragging = { ...this.state.dragging! }
        const date = new Date((e.currentTarget as HTMLElement).dataset["date"]!)
        const xDiff = e.clientX - dragging!.startX

        if (dragging && dragging.startX) {
            if (!dragging.id) {
                const onCreateEvent = this.props.onCreateEvent || ((ev) => ev)
                const eventData = onCreateEvent({
                    start: dragging.startDate,
                    end: addDays(dragging.startDate!, xDiff > 0 ? 1 : 0),
                })
                this.store.dispatch(createEvent(eventData, event => {
                    return new Promise(resolve => {
                        const { id } = event
                        this.setState(s => ({
                            dragging: {
                                ...s.dragging!,
                                id,
                                handle: xDiff > 0 ? "right" : "left"
                            }
                        }), resolve)
                    })
                }))
            } else {
                const event = events[dragging.id]!
                const xDrag = differenceInDays(date, event.start) - dragging.startDateOffset!
                if (!dragging.handle) {
                    await this.store.dispatch(moveEventByID({
                        id: dragging.id,
                        amount: xDrag
                    }))
                } else {
                    await this.store.dispatch(scaleEventByID({
                        id: dragging.id,
                        amount: dragging.handle === "right"
                            ? differenceInDays(date, event.end)
                            : differenceInDays(date, event.start),
                        direction: dragging.handle
                    }))
                }
            }
        }
    }

    onMouseUp = (e: MouseEvent) => {
        const movedX = Math.abs(e.clientX - this.state.dragging!.startX)

        if (this.state.dragging && this.state.dragging.newItem && this.state.dragging.id) {
            this.store.dispatch(selectEvent(this.state.dragging.id))
        } else if (this.state.dragging && this.state.dragging.id && movedX < 5) {
            this.store.dispatch(selectEvent(this.state.dragging.id))
        }
        this.setState({
            dragging: void 0,
        })

        document.removeEventListener("mouseup", this.onMouseUp)
    }

    // updateSelectedItems = () => {
    //     const items = buildData(selectExistingEvents(this.store.getState()))[this.state.cursorRow] || []
    //     const ids = items
    //         .filter(item => isWithinInterval(this.state.cursorDate, { start: item.start, end: addDays(item.end, -1) }))
    //         .map(item => item.id)
    //     this.setState({ selectedItemIDs: ids })
    // }

    getChildProps(props: Props, state: State, reduxState: ReduxState) {
        const users = selectUsers(reduxState)
        const projects = selectProjects(reduxState)
        const eventsArray = selectExistingEvents(reduxState).filter(props.filter || Boolean).map(event => {
            return {
                ...event,
                project: event.projectID ? projects.find(p => p.id === event.projectID) : undefined,
                users: users.filter(u => event.userIDs.includes(u.id)),
            }
        })

        return {
            ...state,
            title: props.title,
            startDate: reduxState.ui.startDate,
            numDays: reduxState.ui.numDays,
            cellWidth: reduxState.ui.cellWidth,
            rowHeight: reduxState.ui.rowHeight,
            parsedData: eventsArray,
            draftID: state.dragging && state.dragging.id,
            data: buildData(
                eventsArray,
                state.dragging
                    ? { id: state.dragging.id!, row: state.dragging.rowIndex }
                    : undefined),
            onMouseDown: this.onMouseDown,
            onMouseEnter: this.onMouseEnter,
        }
    }
}
