export interface BaseData {
    id: string
    title: string
    color: string
    userID?: string
}

export interface RawData extends BaseData {
    start: string
    end: string
}

export interface Data extends BaseData {
    start: Date
    end: Date
}

export default [
    {
        id: "1",
        start: "2020-02-10",
        end: "2020-02-15",
        title: "Foo",
        color: "orange",
    },
    {
        id: "2",
        start: "2020-02-16",
        end: "2020-02-19",
        title: "Foo",
        color: "salmon",
    },
    {
        id: "3",
        start: "2020-02-14",
        end: "2020-02-17",
        title: "Bar",
        color: "rebeccapurple",
    }
]