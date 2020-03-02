import { ReduxContainer } from "react-class-container";
import ReduxState from "../redux/state"
import commitEvents from "../redux/actions/events/commitEvents"

export default class AutoSaver extends ReduxContainer(() => null)<ReduxState> {
    interval = null

    componentDidMount() {
        this.interval = setInterval(() => {
            const { ui: { autoSave }, data: { events } } = this.store.getState()
            if (autoSave && events.some(event => event._state)) {
                this.store.dispatch(commitEvents())
            }
        }, 5000)
    }
}