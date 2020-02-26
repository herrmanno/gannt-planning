import * as React from "react"
import Chart from "./chart/Chart.Container"
import DateHeader from "./chart/DateHeader.container"
import EventEditDialog from "./EventEditDialog.Container"
import KeyHandler from "./KeyHandler"
import Event from "../Event"
import ControlBar from "./ControlBar.Container"

export default App

type Props = {
    selectedEventID?: string
    onSelectEvent(id: string): any
    onCommitEvents(): any
}

function App(props: Props) {
    const unselectEvent = () => props.onSelectEvent(null)

    const filterByAssignee = (event: Event) => !!event.userID

    return (
        <>
            <ControlBar />
            <button onClick={props.onCommitEvents}>Commit</button>
            <DateHeader />
            <Chart title="Foo bar" onSelectEvent={props.onSelectEvent} />
            <Chart title="Assigned" filter={filterByAssignee} onSelectEvent={props.onSelectEvent} />
            {props.selectedEventID &&
                <EventEditDialog eventID={props.selectedEventID} onCancel={unselectEvent} />
            }
            <KeyHandler />
        </>
    )
}