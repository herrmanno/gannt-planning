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

    state = { error: null }

    componentDidMount() {
        const { numDays } = this.store.getState().ui
        this.store.dispatch(setCellWidth(document.body.clientWidth / numDays))
        this.store.dispatch(loadEvents())
        this.store.dispatch(loadUsers())
        this.store.dispatch(loadProject())
    }

    static getDerivedStateFromError(error) {
        return { error }
    }

    componentDidCatch(error, errorInfo) {
        console.error(error)
        console.error(errorInfo)
        setTimeout(() => {
            debugger
            if (this.state.error === error) {
                this.setState({ error: null })
            }
        }, 6_000)
    }

    getChildProps(_props: any, state: any, reduxState: ReduxState) {
        return {
            error: state.error,
            users: selectUsers(reduxState),
            projects: selectProjects(reduxState),
            selectedEventID: reduxState.ui.selectedEventID,
            additionalLaneCategory: reduxState.ui.additionalLaneCategory,
        }
    }
}
