import * as React from "react"
import Event from "../Event"

export default EventEditDialog

type Props = {
    event: Event
    users: { id: string, name: string }[]
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
        background: "white",
        boxShadow: "0px 0px 10px 10px rgba(0,0,0,.2)",
    }

    const styleBackdrop: React.CSSProperties = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "0px 0px 10px 10px rgba(0,0,0,.1)",
    }

    const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChangeEvent({
            title: e.currentTarget.value
        })
    }

    const onChangeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChangeEvent({
            color: e.currentTarget.value
        })
    }

    const onChangeUser = e => props.onChangeEvent({ userID: e.currentTarget.value })

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
                <label>Color</label>
                <input value={props.event.color} onChange={onChangeColor} type="color" />
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