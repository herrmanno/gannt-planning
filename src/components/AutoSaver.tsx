import { ReduxContainer } from "react-class-container";
import ReduxState from "../redux/state"
import commitEvents from "../redux/actions/events/commitEvents"
import selectChangedEvents from "../redux/selectors/selectChangedEvents";

export default class AutoSaver extends ReduxContainer(() => null)<ReduxState> {
    interval = null

    componentDidMount() {
        this.interval = setInterval(() => {
            const state = this.store.getState()
            if (state.ui.autoSave && selectChangedEvents(state).length) {
                this.store.dispatch(commitEvents())
            }
        }, 5000)
    }
}