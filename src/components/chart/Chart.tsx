import * as React from "react"
import { addDays, format, differenceInDays, isWeekend, isToday } from "date-fns"
import Event from "../../Event"
import User from "../../User"
import Project from "../../Project"
import "./Chart.scss"

type ExtendedEvent =
    Event & {
        project?: Project
        users?: User[]
    }

type Props = {
    startDate: Date
    numDays: number
    cellWidth: number
    rowHeight: number
    title?: string
    data: ExtendedEvent[][]
    selectedItemIDs: string[]
    draftID?: string
    // cursorDate: Date
    // cursorRow: number
    onMouseDown: React.MouseEventHandler
    onMouseEnter: React.MouseEventHandler
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
                        onMouseDown={props.onMouseDown} />
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
    draftID?: string
    onMouseDown: React.MouseEventHandler
    onMouseEnter: React.MouseEventHandler
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
                onMouseDown={props.onMouseDown}
                onMouseEnter={props.onMouseEnter} />
        )}
        {props.data.map(itemData =>
            <Item
                key={itemData.id}
                rowIndex={props.index}
                startDate={props.startDate}
                cellWidth={props.cellWidth}
                selected={props.selectedItemIDs.includes(itemData.id)}
                draft={itemData.id === props.draftID}
                data={itemData}
                onMouseDown={props.onMouseDown}
                onMouseEnter={props.onMouseEnter} />
        )}
    </div>
}


type CellProps = {
    rowIndex: number
    date: Date
    cellWidth: number
    onMouseDown: React.MouseEventHandler
    onMouseEnter: React.MouseEventHandler
}

function Cell(props: CellProps) {
    const cellStyle: React.CSSProperties = {
        height: "100%",
        width: props.cellWidth,
        flexBasis: props.cellWidth,
        boxSizing: "border-box",
    }

    const dateString = format(props.date, "dd MM")

    const className = [
        "chart-cell",
        isWeekend(props.date) && "chart-cell--weekend",
        isToday(props.date) && "chart-cell--today"
    ].filter(Boolean).join(" ")

    return (
        <div
            key={dateString}
            data-date={props.date}
            data-row-index={props.rowIndex}
            className={className}
            style={cellStyle}
            onMouseDownCapture={props.onMouseDown}
            onMouseEnter={props.onMouseEnter}
        />
    )
}

type ItemProps = {
    rowIndex: number
    startDate: Date
    cellWidth: number
    selected: boolean
    data: ExtendedEvent
    draft: boolean
    onMouseDown: React.MouseEventHandler
    onMouseEnter: React.MouseEventHandler
}


function Item(props: ItemProps) {
    // treat [start, end] as inclusive interval
    const widthInDays = differenceInDays(props.data.end, props.data.start) + 1

    const style: React.CSSProperties = {
        left: differenceInDays(props.data.start, props.startDate) * props.cellWidth,
        width: widthInDays * props.cellWidth,
        backgroundColor: props.data.project ? props.data.project.color : "#999",
    }

    const title = props.data.title + (props.data.description ? ("\n\n" + props.data.description) : "")
    const dataAttribtes = idx => ({
        "data-itemid": props.data.id,
        "data-row-index": props.rowIndex,
        "data-date": addDays(props.data.start, idx),
        onMouseEnter: props.onMouseEnter,
    })
    const className = [
        "chart-item",
        props.draft && "chart-item--draft"
    ].filter(Boolean).join(" ")

    return (
        <div
            className={className}
            style={style}
            title={title}
            onMouseDown={props.onMouseDown}
        >
            <div
                className="chart-item__handle"
                style={{ left: 0 }}
                data-handle="left"
                {...dataAttribtes(0)} />
            <span className="chart-item__title">{props.data.title}</span>
            <div
                className="chart-item__handle"
                style={{ right: 0 }}
                data-handle="right"
                {...dataAttribtes(widthInDays)} />
            {props.data.users && props.data.users.length > 0 &&
                <div className="chart-item__users">
                    {props.data.users.map(u =>
                        <span
                            key={u.id}
                            className="chart-item__user"
                            style={{ background: u.color }}
                            children={u.name} />
                    )}
                </div>
            }
            <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, display: "flex" }}>
                {new Array(differenceInDays(props.data.end, props.data.start) + 1).fill(0).map((_, idx) =>
                    <div
                        key={props.data.id + idx}
                        style={{ width: props.cellWidth }}
                        {...dataAttribtes(idx)}
                    />
                )}
            </div>
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