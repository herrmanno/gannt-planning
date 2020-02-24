import { ReduxContainer } from "react-class-container"
import { addDays } from "date-fns"
import setStartDate from "../redux/actions/ui/setStartDate"
import loadEvents from "../redux/actions/events/loadEvents"
import setNumDays from "../redux/actions/ui/setNumDays"
import setCellWidth from "../redux/actions/ui/setCellWidth"

export default class KeyHandler extends ReduxContainer(() => null) {
    componentDidMount() {
        document.body.addEventListener("keydown", this.onKeyDown)
    }

    componentWillUnmount() {
        document.body.removeEventListener("keydown", this.onKeyDown)
    }

    onKeyDown = async (e: KeyboardEvent) => {
        if (e.shiftKey) {
            if (e.keyCode === 37) {
                await this.store.dispatch(setStartDate(d => addDays(d, -7)))
                this.store.dispatch(loadEvents())
            } else if (e.keyCode === 39) {
                await this.store.dispatch(setStartDate(d => addDays(d, 7)))
                this.store.dispatch(loadEvents())
            } else if (e.keyCode === 38) {
                const { numDays } = this.store.getState().ui
                await this.store.dispatch(setNumDays(d => d + 7))
                this.store.dispatch(setCellWidth(~~(document.body.clientWidth / (numDays + 7))))
                this.store.dispatch(loadEvents())
            } else if (e.keyCode === 40) {
                const { numDays } = this.store.getState().ui
                await this.store.dispatch(setNumDays(d => d - 7))
                this.store.dispatch(setCellWidth(~~(document.body.clientWidth / (numDays - 7))))
                this.store.dispatch(loadEvents())
            }
        } else if (e.metaKey) {
            // if (e.keyCode === 37) {
            //     e.preventDefault()
            //     await this.store.dispatch(moveEvents({ ids: this.state.selectedItemIDs, amount: -1 }))
            //     this.setState({
            //         cursorDate: addDays(this.state.cursorDate, -1)
            //     })
            // } else if (e.keyCode === 39) {
            //     e.preventDefault()
            //     await this.store.dispatch(moveEvents({ ids: this.state.selectedItemIDs, amount: 1 }))
            //     this.setState({
            //         cursorDate: addDays(this.state.cursorDate, 1)
            //     })
            // }
        } else {
            // if (e.keyCode === 37) {
            //     this.setState({
            //         cursorDate: addDays(this.state.cursorDate, -1)
            //     }, this.updateSelectedItems)
            // } else if (e.keyCode === 39) {
            //     this.setState({
            //         cursorDate: addDays(this.state.cursorDate, 1)
            //     }, this.updateSelectedItems)
            // } else if (e.keyCode === 38) {
            //     this.setState({
            //         cursorRow: this.state.cursorRow - 1
            //     }, this.updateSelectedItems)
            // } else if (e.keyCode === 40) {
            //     this.setState({
            //         cursorRow: this.state.cursorRow + 1
            //     }, this.updateSelectedItems)
            // }
        }
    }
}