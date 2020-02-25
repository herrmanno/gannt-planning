import * as React from "react"
import Event from "../Event"
import { format, parse } from "date-fns"

export default EventEditDialog

type Props = {
    event: Event
    users: { id: string, name: string }[]
    projects: { id: string, name: string, color: string }[]
    onCancel(): any
    onChangeEvent(data: Partial<Event>): any
    onRemoveEvent(id: string): any
}

function EventEditDialog(props: Props) {
    const style: React.CSSProperties = {
        position: "fixed",
        top: "10%",
        left: "20%",
        right: "20%",
        bottom: "20%",
        zIndex: 3,
        background: "white",
        boxShadow: "0px 0px 10px 10px rgba(0,0,0,.2)",
    }

    const styleBackdrop: React.CSSProperties = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
        background: "0px 0px 10px 10px rgba(0,0,0,.1)",
    }

    const onChangeTitle = e => props.onChangeEvent({ title: e.currentTarget.value })

    const onChangeUser = e => props.onChangeEvent({ userID: e.currentTarget.value })

    const onChangeProject = e => props.onChangeEvent({ projectID: e.currentTarget.value })

    const onChangeStart = e => props.onChangeEvent({ start: parse(e.currentTarget.value, "yyyy-MM-dd", 0) })

    const onChangeEnd = e => props.onChangeEvent({ end: parse(e.currentTarget.value, "yyyy-MM-dd", 0) })

    const onRemove = () => {
        props.onRemoveEvent(props.event.id)
        props.onCancel()
    }

    const onCancel = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            props.onCancel()
        }
    }

    return (
        <div style={styleBackdrop} onClick={onCancel}>
            <form style={style}>
                <h1>Event</h1>
                <label>Title</label>
                <input value={props.event.title} onChange={onChangeTitle} />
                <br />
                <label>Start</label>
                <input
                    type="date"
                    value={format(props.event.start, "yyyy-MM-dd")}
                    onChange={onChangeStart} />
                <br />
                <label>End</label>
                <input
                    type="date"
                    value={format(props.event.end, "yyyy-MM-dd")}
                    onChange={onChangeEnd} />
                <label>Project</label>
                <select value={props.event.projectID} onChange={onChangeProject}>
                    <option value={null}></option>
                    {props.projects.map(project =>
                        <option key={project.id} value={project.id} label={project.name} />
                    )}
                </select>
                <br />
                <label>Owner</label>
                <select value={props.event.userID} onChange={onChangeUser}>
                    <option value={null}></option>
                    {props.users.map(user =>
                        <option key={user.id} value={user.id}>{user.name}</option>
                    )}
                </select>
                <br />
                <button onClick={onRemove}>Remove</button>
            </form>
        </div>
    )
}