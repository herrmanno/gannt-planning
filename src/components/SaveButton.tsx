import * as React from "react"
import "./SaveButton.scss"

type Props = {
    autoSave: boolean
    hasChanges: boolean
    setAutoSave(autoSave: boolean): any
    onCommitEvents(): any
}

export default function SaveButton(props: Props) {
    const [open, setOpen] = React.useState(false)
    const toggle = () => setOpen(!open)
    const toggleAutoSave = () => props.setAutoSave(!props.autoSave)

    return (
        <div className="save-button__container">
            <div className="icon-buttons">
                <button
                    className="icon-button material-icons"
                    disabled={!props.hasChanges}
                    onClick={props.onCommitEvents}
                    children="save" />
                <button
                    className="icon-button material-icons"
                    onClick={toggle}
                    children="arrow_drop_down" />
            </div>
            <div className="save-button__dropdown" style={{ display: open ? "block" : "none" }}>
                <div className="save-button__dropdown__option">
                    <label>
                        <input type="checkbox" checked={props.autoSave} onChange={toggleAutoSave} />
                        <span>&nbsp;Autom. speichern</span>
                    </label>
                </div>
            </div>
        </div>
    )
}