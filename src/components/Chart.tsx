import * as React from "react"
import { addDays, format, differenceInDays, isWeekend } from "date-fns"
import { Data } from "../data"


type Props = {
    startDate: Date
    numDays: number
    cellWidth: number
    rowHeight: number
    data: Data[][]
    selectedItemIDs: string[]
    cursorDate: Date
    cursorRow: number
    onMouseDown: React.MouseEventHandler
    onDoubleClick: React.MouseEventHandler
}

export default function Chart(props: Props) {
    const containerStyle: React.CSSProperties = {
        position: "relative"
    }

    return (
        <>
            <Row {...props} dateRow={true} data={[]} />
            <div style={containerStyle}>
                {props.data.map((rowData, idx) =>
                    <Row
                        key={idx}
                        {...props}
                        dateRow={false}
                        data={rowData}
                        onMouseDown={props.onMouseDown}
                        onDoubleClick={props.onDoubleClick} />
                )}
                <Row {...props} dateRow={false} data={[]} />
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
    startDate: Date
    numDays: number
    cellWidth: number
    rowHeight: number
    data: Data[]
    selectedItemIDs: string[]
    dateRow: boolean
    onMouseDown?: React.DragEventHandler
    onDoubleClick: React.MouseEventHandler
}

function Row(props: RowProps) {
    const rowStyle: React.CSSProperties = {
        display: "flex",
        position: "relative",
        width: props.cellWidth * props.numDays,
        height: props.rowHeight,
        boxSizing: "border-box",
        border: "1px solid black",
        borderBottom: "none",
    }

    return <div style={rowStyle}>
        {new Array(props.numDays).fill(0).map((_, idx) =>
            <Cell
                key={addDays(props.startDate, idx).toString()}
                date={addDays(props.startDate, idx)}
                cellWidth={props.cellWidth}
                dateCell={props.dateRow}
                onMouseDown={props.onMouseDown} />
        )}
        {props.data.map(itemData =>
            <Item
                key={itemData.id}
                startDate={props.startDate}
                cellWidth={props.cellWidth}
                selected={props.selectedItemIDs.includes(itemData.id)}
                data={itemData}
                onMouseDown={props.onMouseDown}
                onDoubleClick={props.onDoubleClick} />
        )}
    </div>
}


type CellProps = {
    date: Date
    dateCell: boolean
    cellWidth: number
    onMouseDown: React.MouseEventHandler
}

function Cell(props: CellProps) {
    const cellStyle: React.CSSProperties = {
        height: "100%",
        width: props.cellWidth,
        flexBasis: props.cellWidth,
        boxSizing: "border-box",
        border: "1px solid black",
        background: isWeekend(props.date) ? "lightgrey" : null,
    }

    const dateString = format(props.date, "dd MM")

    return (
        <div
            key={dateString}
            data-date={props.date}
            style={cellStyle}
            onMouseDown={props.onMouseDown}
        >
            {props.dateCell ? dateString : null}
        </div>
    )
}

type ItemProps = {
    startDate: Date
    cellWidth: number
    selected: boolean
    data: Data
    onMouseDown: React.MouseEventHandler
    onDoubleClick: React.MouseEventHandler
}


function Item(props: ItemProps) {

    const style: React.CSSProperties = {
        position: "absolute",
        left: differenceInDays(props.data.start, props.startDate) * props.cellWidth,
        height: "100%",
        width: differenceInDays(props.data.end, props.data.start) * props.cellWidth,
        boxSizing: "border-box",
        backgroundColor: props.data.color,
        border: props.selected ? "1px dashed white" : null,
        userSelect: "none",
    }

    const handleStyle: React.CSSProperties = {
        position: "absolute",
        top: 0,
        bottom: 0,
        width: "10px",
        background: "rgba(0,0,0,0.4)",
    }

    return (
        <div
            style={style}
            data-itemid={props.data.id}
            onMouseDown={props.onMouseDown}
            onDoubleClick={props.onDoubleClick}
        >
            <div data-handle="left" style={{ ...handleStyle, left: 0 }}></div>
            {props.data.title}
            <div data-handle="right" style={{ ...handleStyle, right: 0 }}></div>
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