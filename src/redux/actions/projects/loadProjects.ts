import { Action } from "redux"

export default loadProjects
export { LoadProjects, LOAD_PROJECTS }


const LOAD_PROJECTS = "LOAD_PROJECTS"

interface LoadProjects extends Action {
    type: typeof LOAD_PROJECTS
    payload: {
        projects: { id: string, name: string, color: string }[]
    }
}

function loadProjects(): any {
    return async (dispatch: Function) => {
        const res = await fetch("http://localhost:8080/api/projects")
        const projects = await res.json()

        dispatch({
            type: LOAD_PROJECTS,
            payload: { projects }
        } as LoadProjects)
    }
}
