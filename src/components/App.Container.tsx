import { ReduxContainer } from "react-class-container"
import App from "./App"
import ReduxState from "../redux/State"
import setCellWidth from "../redux/actions/ui/setCellWidth"
import loadEvents from "../redux/actions/events/loadEvents"
import loadUsers from "../redux/actions/users/loadUsers"
import loadProject from "../redux/actions/projects/loadProjects"
import selectUsers from "../redux/selectors/selectUsers"
import selectProjects from "../redux/selectors/selectProjects"

export default class AppContainer extends ReduxContainer(App)<ReduxState> {

    componentDidMount() {
        const { numDays } = this.store.getState().ui
        this.store.dispatch(setCellWidth(document.body.clientWidth / numDays))
        this.store.dispatch(loadEvents())
        this.store.dispatch(loadUsers())
        this.store.dispatch(loadProject())
    }

    getChildProps(_props: any, _state: any, reduxState: ReduxState) {
        return {
            users: selectUsers(reduxState),
            projects: selectProjects(reduxState),
            selectedEventID: reduxState.ui.selectedEventID,
            additionalLaneCategory: reduxState.ui.additionalLaneCategory,
        }
    }
}
