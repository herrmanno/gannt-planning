import State from "../State"
import { AddUndoAction } from "../actions/dataHistory/addUndoAction"
import { AddRedoAction } from "../actions/dataHistory/addRedoAction"
import { Undo } from "../actions/dataHistory/undo"
import { Redo } from "../actions/dataHistory/redo"

export default reducer

type ReducerState = State["dataHistory"]
type Action = AddUndoAction | AddRedoAction | Undo | Redo
const defaultState: ReducerState = { undo: [], redo: [] }


function reducer(state = defaultState, action: Action): ReducerState {
    switch (action.type) {
        case "ADD_UNDO_ACTION": {
            const { id, date } = action.payload
            const lastEventData = state.undo.find(obj => obj.id === id)
            if (!lastEventData || date - lastEventData.date > 1000) {
                return {
                    ...state,
                    undo: [action.payload, ...state.undo],
                }
            } else {
                return state
            }
        }
        case "ADD_REDO_ACTION": {
            return {
                ...state,
                redo: [action.payload, ...state.redo]
            }
        }
        case "UNDO": {
            return {
                ...state,
                undo: state.undo.slice(1),
            }
        }
        case "REDO": {
            return {
                ...state,
                redo: state.redo.slice(1),
            }
        }
        default: return state
    }
}
