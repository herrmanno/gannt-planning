import { ReduxContainer } from "react-class-container"
import App from "./App"
import ReduxState from "../redux/State"
import setCellWidth from "../redux/actions/ui/setCellWidth"
import commitEvents from "../redux/actions/events/commitEvents"
import loadEvents from "../redux/actions/events/loadEvents"
import loadUsers from "../redux/actions/users/loadUsers"
import loadProject from "../redux/actions/projects/loadProjects"

export default class AppContainer extends ReduxContainer(App)<ReduxState> {

    componentDidMount() {
        const { numDays } = this.store.getState().ui
        this.store.dispatch(setCellWidth(~~(document.body.clientWidth / numDays)))
        this.store.dispatch(loadEvents())
        this.store.dispatch(loadUsers())
        this.store.dispatch(loadProject())
    }

    onCommitEvents = () => {
        this.store.dispatch(commitEvents())
    }

    getChildProps(_props: any, _state: any, reduxState: ReduxState) {
        return {
            users: reduxState.data.users,
            projects: reduxState.data.projects,
            hasChanges: reduxState.data.events.some((e: any) => !!e._state),
            selectedEventID: reduxState.ui.selectedEventID,
            onCommitEvents: this.onCommitEvents,
            additionalLaneCategory: reduxState.ui.additionalLaneCategory,
        }
    }
}
