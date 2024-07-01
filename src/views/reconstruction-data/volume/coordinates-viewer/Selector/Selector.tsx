import State from "../state"
import Styles from "./Selector.module.css"

export interface SelectorProps {
    className?: string
}

const Labels = {
    L: "Longitudinal",
    T: "Transverse",
    R: "Radial",
}

export default function Selector({ className }: SelectorProps) {
    const [value, setValue] = State.axe.useState()
    return (
        <div className={`${Styles.Selector} ${className ?? ""}`}>
            <button
                className={value === "L" ? Styles.selected : Styles.unselected}
                onClick={() => setValue("L")}
            >
                {Labels.L}
            </button>
            <button
                className={value === "T" ? Styles.selected : Styles.unselected}
                onClick={() => setValue("T")}
            >
                {Labels.T}
            </button>
            <button
                className={value === "R" ? Styles.selected : Styles.unselected}
                onClick={() => setValue("R")}
            >
                {Labels.R}
            </button>
        </div>
    )
}
