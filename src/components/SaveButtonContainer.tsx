import { ReduxContainer } from "react-class-container"
import SaveButton from "./SaveButton"
import ReduxState from "../redux/state"
import commitEvents from "../redux/actions/events/commitEvents"
import setAutoSave from "../redux/actions/ui/setAutoSave"
import selectChangedEvents from "../redux/selectors/selectChangedEvents"

export default class SaveButtonContainer extends ReduxContainer(SaveButton)<ReduxState> {
    onCommitEvents = () => {
        this.store.dispatch(commitEvents())
    }

    setAutoSave = (autoSave: boolean) => {
        this.store.dispatch(setAutoSave(autoSave))
    }

    getChildProps(_props, _state, reduxState: ReduxState) {
        return {
            autoSave: reduxState.ui.autoSave,
            hasChanges: selectChangedEvents(reduxState).length > 0,
            setAutoSave: this.setAutoSave,
            onCommitEvents: this.onCommitEvents,
        }
    }
}