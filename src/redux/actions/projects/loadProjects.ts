import { Action } from "redux"
import Project from "../../../Project"

export default loadProjects
export { LoadProjects, LOAD_PROJECTS }


const LOAD_PROJECTS = "LOAD_PROJECTS"

interface LoadProjects extends Action {
    type: typeof LOAD_PROJECTS
    payload: {
        projects: Project[]
    }
}

function loadProjects(): any {
    return async (dispatch: Function) => {
        const res = await fetch(`${process.env.SERVER_URL}/api/projects`)
        const projects = await res.json()

        dispatch({
            type: LOAD_PROJECTS,
            payload: { projects }
        } as LoadProjects)
    }
}
