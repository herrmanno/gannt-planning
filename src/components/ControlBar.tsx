import * as React from "react"
import "./ControlBar.scss"

type Props = {
    onMoveViewToPast(): any
    onMoveViewToFuture(): any
    onExtendView(): any
    onReduceView(): any
}

export default function ControlBar(props: Props) {
    return (
        <div>
            <button className="icon-button material-icons" onClick={props.onMoveViewToPast}>arrow_left</button>
            <button className="icon-button material-icons control-bar-button--fold" onClick={props.onExtendView}>unfold_less</button>
            <button className="icon-button material-icons control-bar-button--fold" onClick={props.onReduceView}>unfold_more</button>
            <button className="icon-button material-icons" onClick={props.onMoveViewToFuture}>arrow_right</button>
        </div>
    )
}