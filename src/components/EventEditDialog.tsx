import * as React from "react"
import Event from "../Event"
import { format, parse, isValid } from "date-fns"
import "./EventEditDialog.scss"

export default EventEditDialog

type Props = {
    event: Event
    users: { id: string, name: string }[]
    projects: { id: string, name: string, color: string }[]
    onDone(): any
    onChangeEvent(data: Partial<Event>): any
    onRemoveEvent(id: string): any
}

function EventEditDialog(props: Props) {
    const style: React.CSSProperties = {
        position: "absolute",
        top: "0",
        right: "0%",
        bottom: "00%",
        width: "300px",
        zIndex: 3,
        background: "white",
        boxShadow: "0px 0px 10px 10px rgba(0,0,0,.2)",
    }

    const onChangeTitle = e => props.onChangeEvent({ title: e.currentTarget.value })

    const onChangeUser = e => props.onChangeEvent({ userID: e.currentTarget.value })

    const onChangeProject = e => props.onChangeEvent({ projectID: e.currentTarget.value })

    const onChangeStart = e => {
        const start = parse(e.currentTarget.value, "yyyy-MM-dd", 0)
        if (isValid(start)) {
            props.onChangeEvent({ start })
        }
    }

    const onChangeEnd = e => {
        const end = parse(e.currentTarget.value, "yyyy-MM-dd", 0)
        if (isValid(end)) {
            props.onChangeEvent({ end })
        }
    }

    const onRemove = () => {
        props.onRemoveEvent(props.event.id)
        props.onDone()
    }

    const onDone = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            props.onDone()
        }
    }

    return (
        <form className="event-dialog" style={style}>
            <button className="icon-button material-icons event-dialog__save-button" onClick={onDone} children="close" />
            <label>Title</label>
            <input className="event-dialog__title-input" value={props.event.title} onChange={onChangeTitle} />
            <br />
            <label>Start</label>
            <input
                className="event-dialog__input"
                type="date"
                value={format(props.event.start, "yyyy-MM-dd")}
                onChange={onChangeStart} />
            <br />
            <label>End</label>
            <input
                className="event-dialog__input"
                type="date"
                value={format(props.event.end, "yyyy-MM-dd")}
                onChange={onChangeEnd} />
            <br />
            <label>Project</label>
            <select
                className="event-dialog__select"
                value={props.event.projectID}
                onChange={onChangeProject}
            >
                <option value={null}></option>
                {props.projects.map(project =>
                    <option key={project.id} value={project.id} label={project.name} />
                )}
            </select>
            <br />
            <label>Owner</label>
            <select
                className="event-dialog__select"
                value={props.event.userID}
                onChange={onChangeUser}
            >
                <option value={null}></option>
                {props.users.map(user =>
                    <option key={user.id} value={user.id}>{user.name}</option>
                )}
            </select>
            <br />
            <button className="event-dialog__remove-button" onClick={onRemove}>Remove</button>
        </form>
    )
}