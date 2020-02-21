import { ReduxContainer } from "react-class-container"
import DateHeader from "./DateHeader"
import ReduxState from "../../redux/State"

type Props = {}

type State = {}

export default class DateHeaderContainer extends ReduxContainer(DateHeader)<ReduxState, Props, State> {
    componentDidMount() { }

    getChildProps(_props, _state, reduxState: ReduxState) {
        return {
            startDate: reduxState.ui.startDate,
            numDays: reduxState.ui.numDays,
            cellWidth: reduxState.ui.cellWidth,
            rowHeight: reduxState.ui.rowHeight,
        }
    }
}
