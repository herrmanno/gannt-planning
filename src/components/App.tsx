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
import SaveButton from "./SaveButtonContainer"
import UndoButton from "./UndoButtonContainer"
import AutoSaver from "./AutoSaver"

export default App

type Props = {
    users: User[]
    projects: Project[]
    selectedEventID?: string
    additionalLaneCategory: string
    error?: string
}

function App(props: Props) {
    const sortByName = (a, b) => a.name.localeCompare(b.name)

    const filterByUser = (user: User) => (event: Event) => event.userIDs.includes(user.id)

    const filterByProject = (project: Project) => (event: Event) => project.id === event.projectID

    return (
        <>
            <header className="header">
                {/* <h1 className="header__heading">Gannt</h1> */}
                <SortSelect />
                <ControlBar />
                <div style={{ display: "flex" }}>
                    <UndoButton />
                    <span style={{ height: 24, margin: 6, border: "1px solid rgba(0, 0, 0, 0.3)" }} />
                    <SaveButton />
                </div>
            </header>
            <div style={{ position: "relative", flex: 1 }}>
                <DateHeader />
                <div style={{ overflowY: "auto", overflowX: "hidden" }}>
                    {props.additionalLaneCategory === "NONE" &&
                        <Chart title="Overview" />
                    }
                    {props.additionalLaneCategory === "BY_PROJECT" &&
                        props.projects.sort(sortByName).map(p =>
                            <Chart
                                key={p.id}
                                title={p.name}
                                filter={filterByProject(p)}
                                onCreateEvent={e => ({ ...e, projectID: p.id })} />
                        )
                    }
                    {props.additionalLaneCategory === "BY_USER" &&
                        props.users.sort(sortByName).map(u =>
                            <Chart
                                key={u.id}
                                title={u.name}
                                filter={filterByUser(u)}
                                preferedUserID={u.id}
                                onCreateEvent={e => ({ ...e, userIDs: [u.id] })} />
                        )
                    }
                </div>
            </div>
            {props.selectedEventID &&
                <EventEditDialog eventID={props.selectedEventID} />
            }
            {props.error && <div className="error-notification">Da ist wohl etwas schiefgelaufen…</div>}
            <KeyHandler />
            <ResizeHandler />
            <AutoSaver />
        </>
    )
}