import * as React from "react"

type Props = {
    onMoveViewToPast(): any
    onMoveViewToFuture(): any
    onExtendView(): any
    onReduceView(): any
}

export default function ControlBar(props: Props) {
    return (
        <div>
            <button onClick={props.onMoveViewToPast}>{"<"}</button>
            <button onClick={props.onExtendView}>{"<-->"}</button>
            <button onClick={props.onReduceView}>{">--<"}</button>
            <button onClick={props.onMoveViewToFuture}>{">"}</button>
        </div>
    )
}