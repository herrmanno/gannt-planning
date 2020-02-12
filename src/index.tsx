import * as React from "react"
import * as ReactDOM from "react-dom"
import App from "./components/App.Container"
import { Provider } from "react-class-container"
import store from "./redux/store"

ReactDOM.render(
    <Provider store={store} children={<App />} />,
    document.body.appendChild(document.createElement("main")))