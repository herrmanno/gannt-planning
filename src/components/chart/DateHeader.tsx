import * as React from "react"
import { addDays, format, isToday, getWeek } from "date-fns"
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

    const dates = new Array(props.numDays).fill(0).map((_, idx) => addDays(props.startDate, idx))
    const weeks = dates.filter((date, idx) => idx % 7 == 0)

    return (
        <React.Fragment>
            <div style={rowStyle} className="date-header--weeks">
                {weeks.map(date =>
                    <WeekCell key={date.toString()} date={date} cellWidth={props.cellWidth} />
                )}
            </div>
            <div style={rowStyle} className="date-header">
                {dates.map(date =>
                    <DateCell key={date.toString()} date={date} cellWidth={props.cellWidth} />
                )}
            </div>
        </React.Fragment>
    )
}

function WeekCell(props: { date: Date, cellWidth: number }) {
    const cellStyle = {
        width: 7 * props.cellWidth,
    }
    const weekNumber = getWeek(props.date)
    const from = props.date.getDate() + ". " + props.date.toLocaleDateString("de", { month: "long" })
    const to = addDays(props.date, 7).getDate() + ". " + addDays(props.date, 7).toLocaleDateString("de", { month: "long" })

    return (
        <div className="date-header__cell" style={cellStyle}>
            KW {weekNumber} ({from} - {to})
        </div>
    )

}

function DateCell(props: { date: Date, cellWidth: number }) {
    const cellStyle = {
        width: props.cellWidth,
    }
    const { date, cellWidth } = props
    const className = [
        "date-header__cell",
        isToday(date) && "date-header__cell--today"
    ].filter(Boolean).join(" ")

    return (
        <div className={className} style={cellStyle}>
            {cellWidth <= 70 ? (
                <>
                    {date.toLocaleDateString(navigator.language, { weekday: "short" })}
                    <br />
                    {format(date, "dd")}
                </>
            ) : cellWidth <= 120 ? (
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
    )
}