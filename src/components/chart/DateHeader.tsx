import * as React from "react"
import { addDays, format } from "date-fns"

export default DateHeader

type DateHeaderProps = {
    startDate: Date
    numDays: number
    cellWidth: number
    rowHeight: number
}

function DateHeader(props: DateHeaderProps) {
    const rowStyle: React.CSSProperties = {
        display: "flex",
        position: "relative",
        width: props.cellWidth * props.numDays,
        height: props.rowHeight,
        boxSizing: "border-box",
        border: "1px solid black",
        borderBottom: "none",
    }

    const cellStyle = {
        border: "1px solid rgba(0, 0, 0, 0.3)",
        width: props.cellWidth,
        overflow: "hidden",
    }

    const dates = new Array(props.numDays).fill(0).map((_, idx) => addDays(props.startDate, idx))

    return <div style={rowStyle}>
        {dates.map(date =>
            <div key={date.toString()} style={cellStyle}>
                {props.cellWidth <= 50 ? (
                    <>
                        {format(date, "dd")}
                        <br />
                        {date.toLocaleDateString(navigator.language, { month: "short" })}
                    </>
                ) : props.cellWidth <= 120 ? (
                    <>
                        {date.toLocaleDateString(navigator.language, { weekday: "short" })}
                        <br />
                        {format(date, "dd.")}{"\u00a0"}{date.toLocaleDateString(navigator.language, { month: "short" })}
                    </>
                ) : true ? (
                    <>
                        {date.toLocaleDateString(navigator.language, { weekday: "long" })}
                        <br />
                        {format(date, "dd.")}{"\u00a0"}{date.toLocaleDateString(navigator.language, { month: "long" })}
                    </>
                ) : null}

            </div>
        )}
    </div>
}