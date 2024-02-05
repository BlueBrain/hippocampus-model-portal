import * as React from "react"
import { createRoot } from "react-dom/client"
import App from "./components/App"
import "./index.css"
import { assertType } from "./utils/type-guards"
import { Bounds } from "./types"

async function start() {
    const info = await loadInfo("./data/mesh.json")
    const elemData = new Uint32Array(await loadData("./data/elem.dat"))
    console.log("🚀 [index] elemData = ", elemData) // @FIXME: Remove this line written on 2023-08-02 at 15:09
    const vertData = new Float32Array(await loadData("./data/vert.dat"))
    console.log("🚀 [index] vertData = ", vertData) // @FIXME: Remove this line written on 2023-08-02 at 13:40
    const container = document.getElementById("root") as HTMLElement
    const root = createRoot(container)
    root.render(
        <App meshInfo={info} vert={vertData} elem={Array.from(elemData)} />
    )
    const img = new Image()
    img.src = "background.jpg"
    img.onload = () => {
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
}

async function loadData(url: string): Promise<ArrayBuffer> {
    const resp = await fetch(url)
    return await resp.arrayBuffer()
}

async function loadInfo(url: string): Promise<Bounds> {
    const resp = await fetch(url)
    const data = await resp.json()
    assertType<Bounds>(data, {
        min: ["array(3)", "number"],
        max: ["array(3)", "number"],
    })
    return data
}

void start()
