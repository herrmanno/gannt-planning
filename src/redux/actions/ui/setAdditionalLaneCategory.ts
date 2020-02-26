import { Action } from "redux"

export default setAdditionalLaneCategory

export { SetAdditionalLaneCategory, SET_ADDITIONAL_LANE_CATEGORY }

const SET_ADDITIONAL_LANE_CATEGORY = "SET_ADDITIONAL_LANE_CATEGORY"

interface SetAdditionalLaneCategory extends Action {
    type: typeof SET_ADDITIONAL_LANE_CATEGORY
    payload: {
        category: "NONE" | "BY_PROJECT" | "BY_USER"
    }
}

function setAdditionalLaneCategory(category: "NONE" | "BY_PROJECT" | "BY_USER"): SetAdditionalLaneCategory {
    return {
        type: SET_ADDITIONAL_LANE_CATEGORY,
        payload: { category }
    }
}