import * as React from "react"
import { createRoot } from "react-dom/client"
import PageCoordinates from "./Viewers/Coordinates"

import "./index.css"

function start() {
    const container = document.getElementById("root") as HTMLElement
    const root = createRoot(container)
    root.render(<PageCoordinates />)
    const splash = document.getElementById("splash-screen")
    if (!splash) return

    splash.classList.add("vanish")
    window.setTimeout(() => {
        try {
            const parent = splash.parentNode
            if (!parent) return

            parent.removeChild(splash)
        } catch (ex) {
            // Sometimes, we can get here and splash
            // is already gone.
        }
    }, 1000)
}

void start()
