import * as React from "react"
import "./MultiSelect.scss"

type Props = {
    value: string[]
    options: { id: string, name: string }[]
    onChange(value: string[]): any
}

export default function MultiSelect(props: Props) {
    const onOptionClicked = (e: React.MouseEvent<HTMLElement>) => {
        const optionValue = e.currentTarget.dataset.id!
        if (props.value.includes(optionValue)) {
            props.onChange([
                ...props.value.slice(0, props.value.indexOf(optionValue)),
                ...props.value.slice(props.value.indexOf(optionValue) + 1),
            ])
        } else {
            props.onChange([...props.value, optionValue])
        }
    }

    return (
        <ul className="multiselect">
            {props.options.map(o =>
                <li key={o.id} data-id={o.id} onClick={onOptionClicked}>
                    <input type="checkbox" readOnly checked={props.value.includes(o.id)} />
                    <span className="multiselect-option_title">{o.name}</span>
                </li>
            )}
        </ul>
    )
}