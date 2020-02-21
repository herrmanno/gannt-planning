import EventEditDialog from "./EventEditDialog"
import { ReduxContainer } from "react-class-container"
import ReduxState from "../redux/State"
import patchEvent from "../redux/actions/events/patchEvent"
import loadUsers from "../redux/actions/users/loadUsers"

type Props = {
    eventID: string
    onCancel(): any
}

type State = {}

export default class EventEditDialogContainer extends ReduxContainer(EventEditDialog)<any, Props, State> {

    componentWillMount() {
        this.store.dispatch(loadUsers())
    }

    onChangeEvent = (data: object) => {
        this.store.dispatch(patchEvent({ id: this.props.eventID, ...data }))
    }

    getChildProps(props: Props, _state: any, reduxState: ReduxState) {
        return {
            event: reduxState.data.events.find(e => e.id === props.eventID),
            users: reduxState.data.users,
            onChangeEvent: this.onChangeEvent,
            onCancel: props.onCancel,
        }
    }
}