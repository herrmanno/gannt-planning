import { Action } from "redux"

export default setCellWidth

export { SetCellWidth as SetCellWidth, SET_CELLWIDTH }

const SET_CELLWIDTH = "SET_CELLWIDTH"

interface SetCellWidth extends Action {
    type: typeof SET_CELLWIDTH
    payload: {
        cellWidth: number
    }
}

function setCellWidth(cellWidth: number): SetCellWidth {
    cellWidth = ~~(cellWidth * 100) / 100
    return {
        type: SET_CELLWIDTH,
        payload: { cellWidth }
    }
}