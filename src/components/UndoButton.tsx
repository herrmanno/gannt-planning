import * as React from "react"
import "./UndoButton.scss"

type Props = {
    hasUndos: boolean
    hasRedos: boolean
    onUndo(): any
    onRedo(): any
}

export default function UndoButton(props: Props) {
    return (
        <div className="icon-buttons">
            <button
                className="icon-button material-icons"
                disabled={!props.hasUndos}
                onClick={props.onUndo}
                children="undo" />
            <button
                className="icon-button material-icons"
                disabled={!props.hasRedos}
                onClick={props.onRedo}
                children="redo" />
        </div>
    )
}