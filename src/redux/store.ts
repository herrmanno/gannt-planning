import { createStore, applyMiddleware, Store } from "redux"
import thunk, { ThunkMiddleware } from "redux-thunk"
import State from "./State"
import rootReducer from "./reducers"

export default createStore(
    rootReducer,
    applyMiddleware(thunk as ThunkMiddleware<State, any>),
) as Store<State>
