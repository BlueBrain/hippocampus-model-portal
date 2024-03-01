import { Bounds } from "@/types"
import { assertType } from "./type-guards"

export async function loadData(url: string): Promise<ArrayBuffer> {
    console.log("Loading ", url)
    const resp = await fetch(url)
    return await resp.arrayBuffer()
}

export async function loadInfo(url: string): Promise<Bounds> {
    console.log("Loading ", url)
    const resp = await fetch(url)
    const data: unknown = await resp.json()
    assertType<Bounds>(data, {
        min: ["array(3)", "number"],
        max: ["array(3)", "number"],
    })
    return data
}
