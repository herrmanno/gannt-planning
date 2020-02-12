export default State

import { Data } from "./../data"

type State = {
    data: {
        // TODO: refactor to { ids: string[], data: { [id: string]: Data } }
        events: Data[]
    }
}
