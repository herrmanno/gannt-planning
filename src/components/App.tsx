import * as React from "react"
import Chart from "./chart/Chart.Container"
import DateHeader from "./chart/DateHeader.container"
import EventEditDialog from "./EventEditDialog.Container"
import ControlBar from "./ControlBar.Container"
import KeyHandler from "./KeyHandler"
import Event from "../Event"
import User from "../User"
import Project from "../Project"

export default App

type Props = {
    events: Event[]
    users: User[]
    projects: Project[]

    selectedEventID?: string
    onSelectEvent(id: string): any
    onCommitEvents(): any
    additionalLaneCategory: string
    setAdditionalLaneCategory(category: string): any
}

function App(props: Props) {
    const unselectEvent = () => props.onSelectEvent(null)

    const sortByName = (a, b) => a.name.localeCompare(b.name)

    const filterByUser = (user: User) => (event: Event) => user.id === event.userID

    const filterByProject = (project: Project) => (event: Event) => project.id === event.projectID

    return (
        <>
            <ControlBar />
            <button onClick={props.onCommitEvents}>Commit</button>
            <select
                value={props.additionalLaneCategory}
                onChange={e => props.setAdditionalLaneCategory(e.currentTarget.value)}
            >
                <option value="NONE">Keine</option>
                <option value="BY_PROJECT">Nach Projekt</option>
                <option value="BY_USER">Nach Benutzer</option>
            </select>
            <DateHeader />
            {props.additionalLaneCategory === "NONE" &&
                <Chart title="Overview" onSelectEvent={props.onSelectEvent} />
            }
            {props.additionalLaneCategory === "BY_PROJECT" &&
                props.projects.sort(sortByName).map(p =>
                    <Chart title={p.name} filter={filterByProject(p)} onSelectEvent={props.onSelectEvent} onCreateEvent={e => ({ ...e, projectID: p.id })} />
                )
            }
            {props.additionalLaneCategory === "BY_USER" &&
                props.users.sort(sortByName).map(u =>
                    <Chart title={u.name} filter={filterByUser(u)} onSelectEvent={props.onSelectEvent} onCreateEvent={e => ({ ...e, userID: u.id })} />
                )
            }
            {props.selectedEventID &&
                <EventEditDialog eventID={props.selectedEventID} onCancel={unselectEvent} />
            }
            <KeyHandler />
        </>
    )
}