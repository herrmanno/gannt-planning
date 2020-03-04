import EventEditDialog from "./EventEditDialog"
import { ReduxContainer } from "react-class-container"
import ReduxState from "../redux/State"
import patchEvent from "../redux/actions/events/patchEvent"
import removeEvent from "../redux/actions/events/removeEvent"
import selectEvent from "../redux/actions/ui/selectEvent"
import selectUsers from "../redux/selectors/selectUsers"
import selectProjects from "../redux/selectors/selectProjects"

type Props = {
    eventID: string
}

type State = {}

export default class EventEditDialogContainer extends ReduxContainer(EventEditDialog)<any, Props, State> {

    componentDidMount() {
        document.addEventListener("keydown", this.onKeyDown)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyDown)
    }

    private onKeyDown = (e: KeyboardEvent) => {
        if (e.keyCode === 27 /* esc */) {
            this.onDone()
        } else if (e.keyCode === 46 /* entf */) {
            if (!["INPUT", "TEXTAREA", "SELECT"].includes((e.target as any).tagName)) {
                this.onRemoveEvent(this.props.eventID)
            }
        }
    }

    onChangeEvent = (data: object) => {
        this.store.dispatch(patchEvent({ id: this.props.eventID, ...data }))
    }

    onRemoveEvent = (id: string) => {
        if (window.confirm("Event wirklich entfernern?")) {
            this.store.dispatch(removeEvent(id))
        }
    }

    onDone = () => this.store.dispatch(selectEvent(null))

    getChildProps(props: Props, _state: any, reduxState: ReduxState) {
        return {
            event: reduxState.data.events[props.eventID],
            users: selectUsers(reduxState),
            projects: selectProjects(reduxState),
            onChangeEvent: this.onChangeEvent,
            onRemoveEvent: this.onRemoveEvent,
            onDone: this.onDone,
        }
    }
}
