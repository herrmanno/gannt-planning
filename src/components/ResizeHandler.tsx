import { ReduxContainer } from "react-class-container"
import ReduxState from "../redux/State"
import setCellWidth from "../redux/actions/ui/setCellWidth"
import setNumDays from "../redux/actions/ui/setNumDays"

export default class KeyHandler extends ReduxContainer(() => null)<ReduxState> {

    componentDidMount() {
        window.addEventListener("resize", this.onResize)
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize)
    }

    onResizeTimer = null

    onResize = () => {
        clearTimeout(this.onResizeTimer)
        this.onResizeTimer = setTimeout(() => {
            const { cellWidth, numDays } = this.store.getState().ui
            const oldWidth = cellWidth * numDays
            const newWidth = document.body.clientWidth
            const widthDiff = oldWidth - newWidth
            const oldWeekWidth = cellWidth * 7
            const newNumDays = numDays - 7 * ~~(widthDiff / oldWeekWidth)

            this.store.dispatch(setNumDays(() => newNumDays))
            this.store.dispatch(setCellWidth(document.body.clientWidth / newNumDays))
        }, 500)
    }
}