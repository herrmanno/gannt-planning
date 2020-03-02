import * as React from "react"
import { ReduxContainer } from "react-class-container"
import ReduxState from "../redux/state"
import setAdditionalLaneCategory from "./../redux/actions/ui/setAdditionalLaneCategory"
import "./SortSelect.scss"


export default class SortSelectContainer extends ReduxContainer(SortSelect) {
    setAdditionalLaneCategory = category => this.store.dispatch(setAdditionalLaneCategory(category))

    getChildProps(_props, _state, reduxState: ReduxState) {
        return {
            additionalLaneCategory: reduxState.ui.additionalLaneCategory,
            setAdditionalLaneCategory: this.setAdditionalLaneCategory
        }
    }
}

type Category = ReduxState["ui"]["additionalLaneCategory"]

type Props = {
    additionalLaneCategory: Category
    setAdditionalLaneCategory(category: Category): any
}

function SortSelect(props: Props) {
    const [open, setOpen] = React.useState(false)
    const toggle = () => setOpen(!open)
    const chooseAll = () => (toggle(), props.setAdditionalLaneCategory("NONE"))
    const chooseUser = () => (toggle(), props.setAdditionalLaneCategory("BY_USER"))
    const chooseProject = () => (toggle(), props.setAdditionalLaneCategory("BY_PROJECT"))

    const icon = (
        props.additionalLaneCategory === "BY_USER"
            ? "supervisor_account" :
            props.additionalLaneCategory === "BY_PROJECT"
                ? "ballot" :
                "sort"
    )

    return (
        <div className="sort-select-container">
            <button
                className="icon-button material-icons"
                children={icon}
                onClick={toggle} />
            <div className="sort-select__dropdown" style={{ display: open ? "block" : "none" }}>
                <div className="sort-select__dropdown__option" onClick={chooseAll}>
                    <i className="material-icons" children="all_inclusive" />
                    &nbsp;Alle
                </div>
                <div className="sort-select__dropdown__option" onClick={chooseUser}>
                    <i className="material-icons" children="supervisor_account" />
                    &nbsp;Benutzer
                </div>
                <div className="sort-select__dropdown__option" onClick={chooseProject}>
                    <i className="material-icons" children="ballot" />
                    &nbsp;Projekt
                </div>
            </div>
        </div>
    )
}