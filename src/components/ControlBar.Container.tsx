import { ReduxContainer } from "react-class-container"
import ControlBar from "./ControlBar"
import ReduxState from "../redux/State"
import { addDays, startOfWeek, addWeeks } from "date-fns"
import setStartDate from "../redux/actions/ui/setStartDate"
import loadEvents from "../redux/actions/events/loadEvents"
import setNumDays from "../redux/actions/ui/setNumDays"
import setCellWidth from "../redux/actions/ui/setCellWidth"

export default class ControlBarContainer extends ReduxContainer(ControlBar)<ReduxState> {

    private loadEventsTimeout = null

    private loadEvents() {
        clearTimeout(this.loadEventsTimeout)
        this.loadEventsTimeout = setTimeout(() => {
            this.store.dispatch(loadEvents())
        }, 500)
    }

    onMoveViewToPast = async () => {
        await this.store.dispatch(setStartDate(d => addDays(d, -7)))
        this.loadEvents()
    }

    onMoveViewToFuture = async () => {
        await this.store.dispatch(setStartDate(d => addDays(d, 7)))
        this.loadEvents()
    }

    onExtendView = async () => {
        const { numDays } = this.store.getState().ui
        await this.store.dispatch(setNumDays(d => d + 7))
        this.store.dispatch(setCellWidth(document.body.clientWidth / (numDays + 7)))
        this.loadEvents()
    }

    onReduceView = async () => {
        const { numDays } = this.store.getState().ui
        await this.store.dispatch(setNumDays(d => d - 7))
        this.store.dispatch(setCellWidth(document.body.clientWidth / (numDays - 7)))
    }

    onResetView = async () => {
        const numDays = 28
        await this.store.dispatch(setNumDays(() => numDays))
        await this.store.dispatch(setStartDate(() =>
            startOfWeek(addWeeks(new Date(), -1), { weekStartsOn: 1 }))
        )
        this.store.dispatch(this.store.dispatch(setCellWidth(document.body.clientWidth / numDays)))
        this.loadEvents()
    }

    getChildProps() {
        return {
            onMoveViewToPast: this.onMoveViewToPast,
            onMoveViewToFuture: this.onMoveViewToFuture,
            onExtendView: this.onExtendView,
            onReduceView: this.onReduceView,
            onResetView: this.onResetView,
        }
    }

}
