import * as React from "react"
import MultiSelect from "./MultiSelect"
import Event from "../Event"
import { format, parse, isValid } from "date-fns"
import User from "../User"
import Project from "../Project"
import "./EventEditDialog.scss"

export default EventEditDialog

type Props = {
    event: Event
    users: User[]
    projects: Project[]
    onDone(): any
    onChangeEvent(data: Partial<Event>): any
    onRemoveEvent(id: string): any
}

function EventEditDialog(props: Props) {
    const onChangeTitle = (e: any) => props.onChangeEvent({ title: e.currentTarget.value })

    const onChangeDescription = (e: any) => props.onChangeEvent({ description: e.currentTarget.value })

    const onChangeUser = (userIDs: string[]) => props.onChangeEvent({ userIDs })

    const onChangeProject = (e: any) => props.onChangeEvent({ projectID: e.currentTarget.value })

    const onChangeStart = (e: any) => {
        const start = parse(e.currentTarget.value, "yyyy-MM-dd", 0)
        if (isValid(start) && start < props.event.end) {
            props.onChangeEvent({ start })
        }
    }

    const onChangeEnd = (e: any) => {
        const end = parse(e.currentTarget.value, "yyyy-MM-dd", 0)
        if (isValid(end) && end > props.event.start) {
            props.onChangeEvent({ end })
        }
    }

    const onRemove = () => props.onRemoveEvent(props.event.id)

    const onDone = () => props.onDone()

    const { userIDs, projectID = "" } = props.event

    return (
        <form className="event-dialog" onSubmit={e => e.preventDefault()}>
            <button className="icon-button material-icons event-dialog__save-button" onClick={onDone} children="close" />
            <label className="event-dialog__label" children="Name" />
            <input className="event-dialog__title-input" autoFocus value={props.event.title} onChange={onChangeTitle} />
            <br />
            <label className="event-dialog__label" children="Projekt" />
            <select
                className="event-dialog__select"
                value={projectID}
                onChange={onChangeProject}
            >
                <option value={undefined}></option>
                {props.projects.map(project =>
                    <option key={project.id} value={project.id} label={project.name} />
                )}
            </select>
            <br />
            <label className="event-dialog__label" children="Besitzer" />
            <MultiSelect value={userIDs} options={props.users} onChange={onChangeUser} />
            < br />
            <label className="event-dialog__label" children="Start" />
            <input
                className="event-dialog__input"
                type="date"
                value={format(props.event.start, "yyyy-MM-dd")}
                onChange={onChangeStart} />
            <br />
            <label className="event-dialog__label" children="Ende" />
            <input
                className="event-dialog__input"
                type="date"
                value={format(props.event.end, "yyyy-MM-dd")}
                onChange={onChangeEnd} />
            <br />
            <label className="event-dialog__label" children="Beschreibung" />
            <textarea
                className="event-dialog__textarea"
                rows={8}
                value={props.event.description || ""}
                onChange={onChangeDescription} />
            <br />
            <button className="event-dialog__remove-button" onClick={onRemove} children="Löschen" />
        </form >
    )
}