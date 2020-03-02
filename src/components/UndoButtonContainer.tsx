import { ReduxContainer } from "react-class-container"
import UndoButton from "./UndoButton"
import ReduxState from "../redux/state"
import undo from "../redux/actions/dataHistory/undo"
import redo from "../redux/actions/dataHistory/redo"

export default class UndoButtonContainer extends ReduxContainer(UndoButton)<ReduxState> {
    onUndo = () => this.store.dispatch(undo())

    onRedo = () => this.store.dispatch(redo())

    getChildProps(_props, _state, reduxState: ReduxState) {
        return {
            hasUndos: reduxState.dataHistory.undo.length > 0,
            hasRedos: reduxState.dataHistory.redo.length > 0,
            onUndo: this.onUndo,
            onRedo: this.onRedo,
        }
    }
}