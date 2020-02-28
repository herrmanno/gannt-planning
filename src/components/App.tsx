import * as React from "react"
import Chart from "./chart/Chart.Container"
import DateHeader from "./chart/DateHeader.container"
import EventEditDialog from "./EventEditDialog.Container"
import ControlBar from "./ControlBar.Container"
import SortSelect from "./SortSelect"
import KeyHandler from "./KeyHandler"
import ResizeHandler from "./ResizeHandler"
import Event from "../Event"
import User from "../User"
import Project from "../Project"
import "./App.scss"

export default App

type Props = {
    users: User[]
    projects: Project[]
    hasChanges: boolean

    selectedEventID?: string
    onSelectEvent(id: string): any
    onCommitEvents(): any
    additionalLaneCategory: string
}

function App(props: Props) {
    const unselectEvent = () => props.onSelectEvent(null)

    const sortByName = (a, b) => a.name.localeCompare(b.name)

    const filterByUser = (user: User) => (event: Event) => user.id === event.userID

    const filterByProject = (project: Project) => (event: Event) => project.id === event.projectID

    return (
        <>
            <header className="header">
                {/* <h1 className="header__heading">Gannt</h1> */}
                <SortSelect />
                <ControlBar />
                <button
                    className="icon-button material-icons"
                    disabled={!props.hasChanges}
                    onClick={props.onCommitEvents}
                    children="save" />
            </header>
            <div style={{ position: "relative", flex: 1 }}>
                <DateHeader />
                <div style={{ overflowY: "auto", overflowX: "hidden" }}>
                    {props.additionalLaneCategory === "NONE" &&
                        <Chart title="Overview" onSelectEvent={props.onSelectEvent} />
                    }
                    {props.additionalLaneCategory === "BY_PROJECT" &&
                        props.projects.sort(sortByName).map(p =>
                            <Chart
                                key={p.id}
                                title={p.name}
                                filter={filterByProject(p)}
                                onSelectEvent={props.onSelectEvent}
                                onCreateEvent={e => ({ ...e, projectID: p.id })} />
                        )
                    }
                    {props.additionalLaneCategory === "BY_USER" &&
                        props.users.sort(sortByName).map(u =>
                            <Chart
                                key={u.id}
                                title={u.name}
                                filter={filterByUser(u)}
                                onSelectEvent={props.onSelectEvent}
                                onCreateEvent={e => ({ ...e, userID: u.id })} />
                        )
                    }
                </div>
                {props.selectedEventID &&
                    <EventEditDialog eventID={props.selectedEventID} onCancel={unselectEvent} />
                }
            </div>
            <KeyHandler />
            <ResizeHandler />
        </>
    )
}