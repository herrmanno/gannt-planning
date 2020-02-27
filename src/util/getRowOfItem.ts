import Event from "../Event"

export default getRowOfItem

/**
 * @deprecated
 */
function getRowOfItem(id: string, data: Event[][]): number {
    return data.findIndex(row => row.some(item => item.id === id))
}