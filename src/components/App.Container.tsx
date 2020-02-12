import App from "./App"
import { Container } from "react-class-container"

type State = {
    selectedEventID?: string
}

export default class AppContainer extends Container(App)<{}, State> {
    state = {
        selectedEventID: null
    }

    onSelectEvent = (id: string) => {
        this.setState({ selectedEventID: id })
    }

    getChildProps(_props: any, state: State) {
        return {
            ...state,
            onSelectEvent: this.onSelectEvent,
        }
    }
}
