import { ReduxContainer } from "react-class-container"
import { startOfWeek, addDays, isWithinInterval } from "date-fns"
import Chart from "./Chart"
import buildData from "../../util/buildData"
import getRowOfItem from "../../util/getRowOfItem"
import ReduxState from "../../redux/State"
import loadEvents from "../../redux/actions/events/loadEvents"
import createEvent from "../../redux/actions/events/createEvent"
import moveEvents from "../../redux/actions/events/moveEvents"
import scaleEvents from "../../redux/actions/events/scaleEvents"
import Event from "../../Event"
import loadProjects from "../../redux/actions/projects/loadProjects"
import loadUsers from "../../redux/actions/users/loadUsers"

type Props = {
    title?: string
    filter?(data: Event): boolean
    onCreateEvent?(event: Partial<Event>): Partial<Event>
    onSelectEvent(id: string): any
}

type State = {
    cursorDate: Date
    cursorRow: number
    selectedItemIDs: string[]
    dragging?: { id: string, startX: number, handle?: "left" | "right", startDate?: Date }
}

export default class ChartContainer extends ReduxContainer(Chart)<ReduxState, Props, State> {
    state: State = {
        cursorDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
        cursorRow: 0,
        selectedItemIDs: [],
    }

    componentDidMount() {
        this.store.dispatch(loadEvents())
        this.store.dispatch(loadUsers())
        this.store.dispatch(loadProjects())
    }

    onMouseDown = (e: React.DragEvent) => {
        if (e.button === 0 /* left button */) {
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
    }

    onMouseMove = async (e: MouseEvent) => {
        const { cellWidth } = this.store.getState().ui
        const dragging = { ...this.state.dragging }
        const xDiff = ~~((e.clientX - dragging!.startX) / cellWidth)

        if (xDiff !== 0) {
            if (!dragging.id) {
                const onCreateEvent = this.props.onCreateEvent || ((ev) => ev)
                const eventData = onCreateEvent({
                    start: dragging.startDate,
                    end: addDays(dragging.startDate, 1),
                    title: "BAZ",
                    color: "#ee7733",
                })
                const event: any = await this.store.dispatch(createEvent(eventData))
                dragging.id = event.id
                dragging.handle = xDiff > 0 ? "right" : "left"
                this.setState({
                    dragging,
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
        this.setState({
            dragging: null,
        })

        document.removeEventListener("mousemove", this.onMouseMove)
        document.removeEventListener("mouseup", this.onMouseUp)
    }

    onDoubleClick = (e: React.MouseEvent) => {
        const { itemid } = (e.currentTarget as any).dataset
        this.props.onSelectEvent(itemid)
    }

    updateSelectedItems = () => {
        const items = buildData(this.store.getState().data.events)[this.state.cursorRow] || []
        const ids = items
            .filter(item => isWithinInterval(this.state.cursorDate, { start: item.start, end: addDays(item.end, -1) }))
            .map(item => item.id)
        this.setState({ selectedItemIDs: ids })
    }

    getChildProps(props: Props, state: State, reduxState: ReduxState) {
        const { events, users, projects } = reduxState.data
        const eventsArray = events.filter(props.filter || Boolean).map(event => {
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
                    ? { id: state.dragging.id, row: getRowOfItem(state.dragging.id, this.lastChildProps.data) }
                    : undefined),
            onMouseDown: this.onMouseDown,
            onDoubleClick: this.onDoubleClick,
        }
    }
}
