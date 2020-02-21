import * as React from "react"
import Chart from "./Chart.Container"
import EventEditDialog from "./EventEditDialog.Container"

export default App

type Props = {
    selectedEventID?: string
    onSelectEvent(id: string): any
    onCommitEvents(): any
}

function App(props: Props) {
    const unselectEvent = () => props.onSelectEvent(null)

    return (
        <>
            <button onClick={props.onCommitEvents}>Commit</button>
            <Chart onSelectEvent={props.onSelectEvent} />
            {props.selectedEventID &&
                <EventEditDialog eventID={props.selectedEventID} onCancel={unselectEvent} />
            }
        </>
    )
}