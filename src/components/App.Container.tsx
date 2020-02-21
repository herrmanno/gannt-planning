import { ReduxContainer } from "react-class-container"
import App from "./App"
import ReduxState from "../redux/State"
import commitEvents from "../redux/actions/events/commitEvents"

type State = {
    selectedEventID?: string
}

export default class AppContainer extends ReduxContainer(App)<ReduxState, {}, State> {
    state = {
        selectedEventID: null
    }

    onSelectEvent = (id: string) => {
        this.setState({ selectedEventID: id })
    }

    onCommitEvents = () => {
        this.store.dispatch(commitEvents())
    }

    getChildProps(_props: any, state: State) {
        return {
            ...state,
            onSelectEvent: this.onSelectEvent,
            onCommitEvents: this.onCommitEvents,
        }
    }
}
