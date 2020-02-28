import { ReduxContainer } from "react-class-container"
import App from "./App"
import ReduxState from "../redux/State"
import setCellWidth from "../redux/actions/ui/setCellWidth"
import commitEvents from "../redux/actions/events/commitEvents"

type State = {
    selectedEventID?: string
}

export default class AppContainer extends ReduxContainer(App)<ReduxState, {}, State> {
    state = {
        selectedEventID: null
    }

    componentDidMount() {
        const { numDays } = this.store.getState().ui
        this.store.dispatch(setCellWidth(~~(document.body.clientWidth / numDays)))
    }

    onSelectEvent = (id: string) => {
        this.setState({ selectedEventID: id })
    }

    onCommitEvents = () => {
        this.store.dispatch(commitEvents())
    }

    getChildProps(_props: any, state: State, reduxState: ReduxState) {
        return {
            ...state,
            users: reduxState.data.users,
            projects: reduxState.data.projects,
            hasChanges: reduxState.data.events.some((e: any) => !!e._state),
            onSelectEvent: this.onSelectEvent,
            onCommitEvents: this.onCommitEvents,
            additionalLaneCategory: reduxState.ui.additionalLaneCategory,
        }
    }
}
