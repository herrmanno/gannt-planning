import { ReduxContainer } from "react-class-container"
import App from "./App"
import ReduxState from "../redux/State"
import setCellWidth from "../redux/actions/ui/setCellWidth"
import commitEvents from "../redux/actions/events/commitEvents"
import setAdditionalLaneCategory from "../redux/actions/ui/setAdditionalLaneCategory"

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

    setAdditionalLaneCategory = (category: any) => {
        this.store.dispatch(setAdditionalLaneCategory(category))
    }

    getChildProps(_props: any, state: State, reduxState: ReduxState) {
        return {
            ...state,
            ...reduxState.data,
            onSelectEvent: this.onSelectEvent,
            onCommitEvents: this.onCommitEvents,
            additionalLaneCategory: reduxState.ui.additionalLaneCategory,
            setAdditionalLaneCategory: this.setAdditionalLaneCategory,
        }
    }
}
