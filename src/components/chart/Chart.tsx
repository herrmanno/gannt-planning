import * as React from "react"
import { addDays, format, differenceInDays, isWeekend } from "date-fns"
import Event from "../../Event"
import User from "../../User"
import Project from "../../Project"
import "./Chart.scss"

type ExtendedEvent =
    Event & {
        project?: Project
        user?: User
    }

type Props = {
    startDate: Date
    numDays: number
    cellWidth: number
    rowHeight: number
    title?: string
    data: ExtendedEvent[][]
    selectedItemIDs: string[]
    // cursorDate: Date
    // cursorRow: number
    onMouseDown: React.MouseEventHandler
    onSelectEvent(id: string): any
    onEditEvent(id: string): any
}

export default function Chart(props: Props) {
    const containerStyle: React.CSSProperties = {
        position: "relative"
    }

    const headerStyle: React.CSSProperties = {
        height: ~~(props.rowHeight / 1.5),
        width: props.numDays * props.cellWidth,
        boxSizing: "border-box",
    }

    return (
        <>
            <div style={containerStyle}>
                {props.title &&
                    <div className="chart-row-header" style={headerStyle}>{props.title}</div>
                }
                {props.data.map((rowData, idx) =>
                    <Row
                        key={idx}
                        index={idx}
                        {...props}
                        data={rowData}
                        onMouseDown={props.onMouseDown}
                        onSelectEvent={props.onSelectEvent}
                        onEditEvent={props.onEditEvent} />
                )}
                <Row index={props.data.length} {...props} data={[]} />
                {/* <Cursor
                    date={props.cursorDate}
                    row={props.cursorRow}
                    startDate={props.startDate}
                    cellWidth={props.cellWidth}
                    rowHeight={props.rowHeight} /> */}
            </div>
        </>
    )
}


type RowProps = {
    index: number
    startDate: Date
    numDays: number
    cellWidth: number
    rowHeight: number
    data: ExtendedEvent[]
    selectedItemIDs: string[]
    onMouseDown?: React.DragEventHandler
    onSelectEvent(id: string): any
    onEditEvent(id: string): any
}

function Row(props: RowProps) {
    const rowStyle: React.CSSProperties = {
        display: "flex",
        position: "relative",
        width: props.cellWidth * props.numDays,
        height: props.rowHeight,
        boxSizing: "border-box",
    }

    return <div className="chart-row" style={rowStyle}>
        {new Array(props.numDays).fill(0).map((_, idx) =>
            <Cell
                key={addDays(props.startDate, idx).toString()}
                rowIndex={props.index}
                date={addDays(props.startDate, idx)}
                cellWidth={props.cellWidth}
                onMouseDown={props.onMouseDown} />
        )}
        {props.data.map(itemData =>
            <Item
                key={itemData.id}
                rowIndex={props.index}
                startDate={props.startDate}
                cellWidth={props.cellWidth}
                selected={props.selectedItemIDs.includes(itemData.id)}
                data={itemData}
                onMouseDown={props.onMouseDown}
                onSelectEvent={props.onSelectEvent}
                onEditEvent={props.onEditEvent} />
        )}
    </div>
}


type CellProps = {
    rowIndex: number
    date: Date
    cellWidth: number
    onMouseDown: React.MouseEventHandler
}

function Cell(props: CellProps) {
    const cellStyle: React.CSSProperties = {
        height: "100%",
        width: props.cellWidth,
        flexBasis: props.cellWidth,
        boxSizing: "border-box",
    }

    const dateString = format(props.date, "dd MM")

    return (
        <div
            key={dateString}
            data-date={props.date}
            data-row-index={props.rowIndex}
            className={isWeekend(props.date) ? "chart-cell--weekend" : "chart-cell"}
            style={cellStyle}
            onMouseDown={props.onMouseDown}
        />
    )
}

type ItemProps = {
    rowIndex: number
    startDate: Date
    cellWidth: number
    selected: boolean
    data: ExtendedEvent
    onMouseDown: React.MouseEventHandler
    onSelectEvent(id: string): any
    onEditEvent(id: string): any
}


function Item(props: ItemProps) {

    const style: React.CSSProperties = {
        left: differenceInDays(props.data.start, props.startDate) * props.cellWidth,
        // treat [start, end] as inclusive interval
        width: (differenceInDays(props.data.end, props.data.start) + 1) * props.cellWidth,
        backgroundColor: props.data.project ? props.data.project.color : "#999",
        // border: props.selected ? "1px dashed white" : null,
    }

    const userStyle: React.CSSProperties = {
        background: props.data.user && props.data.user.color,
    }

    const onEditEvent = () => props.onEditEvent(props.data.id)
    const onSelectEvent = () => props.onSelectEvent(props.data.id)

    return (
        <div
            className="chart-item"
            style={style}
            data-itemid={props.data.id}
            data-row-index={props.rowIndex}
            onMouseDown={props.onMouseDown}
            onDoubleClick={onEditEvent}
            onClick={onSelectEvent}
        >
            <div className="chart-item__handle" data-handle="left" style={{ left: 0 }}></div>
            <span className="chart-item__title">{props.data.title}</span>
            {props.data.user &&
                <span className="chart-item__user" style={userStyle}>{props.data.user.name}</span>
            }
            <div className="chart-item__handle" data-handle="right" style={{ right: 0 }}></div>
        </div>
    )
}

type CursorProps = {
    date: Date
    row: number
    startDate: Date
    cellWidth: number
    rowHeight: number
}


function Cursor(props: CursorProps) {

    const style: React.CSSProperties = {
        position: "absolute",
        top: props.row * props.rowHeight,
        left: differenceInDays(props.date, props.startDate) * props.cellWidth,
        height: props.rowHeight,
        width: props.cellWidth,
        boxSizing: "border-box",
        border: "2px solid red",
    }

    return <div style={style}></div>
}