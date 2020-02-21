import * as React from "react"
import { Data } from "../data"

export default EventEditDialog

type Props = {
    event: Data
    users: { id: string, name: string }[]
    onCancel(): any
    onChangeEvent(data: Partial<Data>): any
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
            <div style={style}>
                <h1>Event</h1>
                <input value={props.event.title} onChange={onChangeTitle} />
                <input value={props.event.color} onChange={onChangeColor} type="color" />
                <select value={props.event.userID} onChange={onChangeUser}>
                    <option value={null}></option>
                    {props.users.map(user =>
                        <option key={user.id} value={user.id}>{user.name}</option>
                    )}
                </select>
                <button onClick={onRemove}>Remove</button>
            </div>
        </div>
    )
}