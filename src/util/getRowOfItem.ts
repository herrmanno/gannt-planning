import { Data } from "../data"

export default getRowOfItem

function getRowOfItem(id: string, data: Data[][]): number {
    return data.findIndex(row => row.some(item => item.id === id))
}