import EventEditDialog from "./EventEditDialog"
import { ReduxContainer } from "react-class-container"
import ReduxState from "../redux/State"
import patchEvent from "../redux/actions/events/patchEvent"
import loadUsers from "../redux/actions/users/loadUsers"
import loadProjects from "../redux/actions/projects/loadProjects"
import removeEvent from "../redux/actions/events/removeEvent"
import selectEvent from "../redux/actions/ui/selectEvent"

type Props = {
    eventID: string
    onDone(): any
}

type State = {}

export default class EventEditDialogContainer extends ReduxContainer(EventEditDialog)<any, Props, State> {

    componentDidMount() {
        this.store.dispatch(loadUsers())
        this.store.dispatch(loadProjects())
    }

    onChangeEvent = (data: object) => {
        this.store.dispatch(patchEvent({ id: this.props.eventID, ...data }))
    }

    onRemoveEvent = (id: string) => {
        this.store.dispatch(removeEvent(id))
    }

    onDone = () => this.store.dispatch(selectEvent(null))

    getChildProps(props: Props, _state: any, reduxState: ReduxState) {
        return {
            event: reduxState.data.events.find(e => e.id === props.eventID),
            users: reduxState.data.users,
            projects: reduxState.data.projects,
            onChangeEvent: this.onChangeEvent,
            onRemoveEvent: this.onRemoveEvent,
            onDone: this.onDone,
        }
    }
}
