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

    onResizeTimer: any = null

    onResize = () => {
        clearTimeout(this.onResizeTimer)
        this.onResizeTimer = setTimeout(() => {
            const numDays = 7 * ~~(document.body.clientWidth / 350)
            this.store.dispatch(setNumDays(() => numDays))
            this.store.dispatch(setCellWidth(document.body.clientWidth / numDays))
        }, 500)
    }
}