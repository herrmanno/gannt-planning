import * as React from "react"
import { addDays, format } from "date-fns"
import "./DateHeader.scss"

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
        width: props.cellWidth * props.numDays,
    }

    const cellStyle = {
        // border: "1px solid rgba(0, 0, 0, 0.3)",
        width: props.cellWidth,
        // overflow: "hidden",
    }

    const dates = new Array(props.numDays).fill(0).map((_, idx) => addDays(props.startDate, idx))

    return <div style={rowStyle} className="date-header">
        {dates.map(date =>
            <div key={date.toString()} style={cellStyle} className="date-header__cell">
                {props.cellWidth <= 70 ? (
                    <>
                        {date.toLocaleDateString(navigator.language, { weekday: "short" })}
                        <br />
                        {format(date, "dd")}
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