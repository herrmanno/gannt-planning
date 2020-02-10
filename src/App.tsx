import * as React from "react"
import { addDays, format, differenceInDays, isWeekend } from "date-fns"


type Props = {
    startDate: Date
    numDays: number
    cellWidth: number
    rowHeight: number
    data: Array<Array<{ id: string, start: Date, end: Date, title: string, color: string }>>
    selectedItemIDs: string[]
    cursorDate: Date
    cursorRow: number
}

export default function App(props: Props) {
    const containerStyle: React.CSSProperties = {
        position: "relative"
    }

    return (
        <>
            <Row {...props} dateRow={true} data={[]} />
            <div style={containerStyle}>
                {props.data.map((rowData, idx) => <Row key={idx} {...props} dateRow={false} data={rowData} />)}
                <Cursor date={props.cursorDate} row={props.cursorRow} startDate={props.startDate} cellWidth={props.cellWidth} rowHeight={props.rowHeight} />
            </div>
        </>
    )
}


type RowProps = {
    startDate: Date
    numDays: number
    cellWidth: number
    rowHeight: number
    data: Array<{ id: string, start: Date, end: Date, title: string, color: string }>
    selectedItemIDs: string[]
    dateRow: boolean
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
            <Cell key={addDays(props.startDate, idx).toString()} date={addDays(props.startDate, idx)} cellWidth={props.cellWidth} dateCell={props.dateRow} />
        )}
        {props.data.map(itemData =>
            <Item
                key={itemData.id}
                startDate={props.startDate}
                cellWidth={props.cellWidth}
                selected={props.selectedItemIDs.includes(itemData.id)}
                data={itemData} />
        )}
    </div>
}


type CellProps = {
    date: Date
    dateCell: boolean
    cellWidth: number
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

    return <div key={dateString} style={cellStyle}>{props.dateCell ? dateString : null}</div>
}

type ItemProps = {
    startDate: Date
    cellWidth: number
    selected: boolean
    data: { start: Date, end: Date, title: string, color: string }
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
    }

    return <div style={style}>{props.data.title}</div>
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