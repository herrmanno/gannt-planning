import * as React from "react"
import Chart from "./Chart.Container"
import EventEditDialog from "./EventEditDialog.Container"

export default App

type Props = {
    selectedEventID?: string
    onSelectEvent(id: string): any
}

function App(props: Props) {
    const unselectEvent = () => props.onSelectEvent(null)

    return (
        <>
            <Chart onSelectEvent={props.onSelectEvent} />
            {props.selectedEventID &&
                <EventEditDialog eventID={props.selectedEventID} onCancel={unselectEvent} />
            }
        </>
    )
}