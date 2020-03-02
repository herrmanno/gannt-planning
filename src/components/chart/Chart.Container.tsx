import { ReduxContainer } from "react-class-container"
import { startOfWeek, addDays, isWithinInterval } from "date-fns"
import Chart from "./Chart"
import buildData from "../../util/buildData"
import ReduxState from "../../redux/State"
import createEvent from "../../redux/actions/events/createEvent"
import moveEvents from "../../redux/actions/events/moveEvents"
import scaleEvents from "../../redux/actions/events/scaleEvents"
import selectEvent from "../../redux/actions/ui/selectEvent"
import Event from "../../Event"
import selectExistingEvents from "../../redux/selectors/selectExistingEvents"

type Props = {
    title?: string
    filter?(data: Event): boolean
    onCreateEvent?(event: Partial<Event>): Partial<Event>
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
        newItem: boolean
    }
}

export default class ChartContainer extends ReduxContainer(Chart)<ReduxState, Props, State> {
    state: State = {
        cursorDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
        cursorRow: 0,
        selectedItemIDs: [],
    }

    onMouseDown = (e: React.DragEvent) => {
        if (e.button === 0 /* left button */) {
            const { cellWidth } = this.store.getState().ui
            const id = (e.currentTarget as HTMLElement).dataset["itemid"]
            const handle = (e.target as HTMLElement).dataset["handle"] as any
            this.setState({
                dragging: {
                    newItem: true,
                    rowIndex: +(e.currentTarget as HTMLElement).dataset["rowIndex"],
                    id,
                    handle,
                    startX: e.clientX + ((!id && handle === "right") ? cellWidth : 0),
                    startDate: new Date((e.currentTarget as HTMLElement).dataset["date"]),
                }
            })

            document.addEventListener("mousemove", this.onMouseMove)
            document.addEventListener("mouseup", this.onMouseUp)
        }
    }

    onMouseMove = async (e: MouseEvent) => {
        const { cellWidth } = this.store.getState().ui
        const dragging = { ...this.state.dragging }
        const xDiff = ~~((e.clientX - dragging!.startX) * 2 / cellWidth)

        if (xDiff !== 0) {
            if (!dragging.id) {
                const onCreateEvent = this.props.onCreateEvent || ((ev) => ev)
                const eventData = onCreateEvent({
                    start: dragging.startDate,
                    end: addDays(dragging.startDate, 1),
                })
                const createEventAction = createEvent(eventData)
                const { id } = createEventAction.payload.event
                this.setState(s => ({
                    dragging: {
                        ...s.dragging, id, handle: xDiff > 0 ? "right" : "left"
                    }
                }), () => {
                    this.store.dispatch(createEventAction)
                })
            } else {
                if (!this.state.dragging.handle) {
                    await this.store.dispatch(moveEvents({ ids: [dragging.id], amount: xDiff }) as any)
                    this.setState({
                        dragging: {
                            ...dragging,
                            startX: dragging.startX + xDiff * cellWidth
                        },
                    })
                } else {
                    await this.store.dispatch(scaleEvents({ ids: [dragging.id], amount: xDiff, direction: dragging.handle }) as any)
                    this.setState({
                        dragging: {
                            ...dragging,
                            startX: dragging.startX + xDiff * cellWidth
                        },
                    })
                }
            }
        }
    }

    onMouseUp = () => {
        if (this.state.dragging && this.state.dragging.id) {
            this.onEditEvent(this.state.dragging.id)
        }
        this.setState({
            dragging: null,
        })

        document.removeEventListener("mousemove", this.onMouseMove)
        document.removeEventListener("mouseup", this.onMouseUp)
    }

    onSelectEvent = (id: string) => {
        const { selectedEventID } = this.store.getState().ui
        if (selectedEventID) {
            this.store.dispatch(selectEvent(id))
        }
    }

    onEditEvent = (id: string) => {
        this.store.dispatch(selectEvent(id))
    }

    updateSelectedItems = () => {
        const items = buildData(this.store.getState().data.events)[this.state.cursorRow] || []
        const ids = items
            .filter(item => isWithinInterval(this.state.cursorDate, { start: item.start, end: addDays(item.end, -1) }))
            .map(item => item.id)
        this.setState({ selectedItemIDs: ids })
    }

    getChildProps(props: Props, state: State, reduxState: ReduxState) {
        const { users, projects } = reduxState.data
        const eventsArray = selectExistingEvents(reduxState).filter(props.filter || Boolean).map(event => {
            return {
                ...event,
                project: event.projectID && projects.find(p => p.id === event.projectID),
                user: event.userID && users.find(u => u.id === event.userID),
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
            data: buildData(
                eventsArray,
                state.dragging
                    // ? { id: state.dragging.id, row: getRowOfItem(state.dragging.id, this.lastChildProps.data) }
                    ? { id: state.dragging.id, row: state.dragging.rowIndex }
                    : undefined),
            onMouseDown: this.onMouseDown,
            onSelectEvent: this.onSelectEvent,
            onEditEvent: this.onEditEvent,
        }
    }
}
