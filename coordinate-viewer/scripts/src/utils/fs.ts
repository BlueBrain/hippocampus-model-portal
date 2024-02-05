import FS from "node:fs/promises"
import Path from "node:path"
import Readline from "node:readline/promises"

const ROOT = Path.resolve(new URL(import.meta.url).pathname, "../../../..")

console.log("🚀 [fs] ROOT = ", ROOT) // @FIXME: Remove this line written on 2023-07-11 at 11:58

export async function loadArrayBuffer(filename: string): Promise<ArrayBuffer> {
    const data = await FS.readFile(Path.resolve(ROOT, filename), { flag: "r" })
    return data.buffer
}

export async function saveFloat32Array(
    filename: string,
    data: Float32Array
): Promise<void> {
    await FS.writeFile(Path.resolve(ROOT, filename), data)
}

export async function saveUint32Array(
    filename: string,
    data: Uint32Array
): Promise<void> {
    await FS.writeFile(Path.resolve(ROOT, filename), data)
}

export async function saveJSON(filename: string, data: any): Promise<void> {
    await FS.writeFile(Path.resolve(ROOT, filename), JSON.stringify(data))
}

export async function forEachLineInTextFile(
    filename: string,
    action: (line: string) => void
) {
    const fd = await FS.open(Path.resolve(ROOT, filename))
    const inputStream = fd.createReadStream()
    const reader = Readline.createInterface({
        input: inputStream,
        terminal: false,
    })
    return new Promise(resolve => {
        reader.on("line", action)
        reader.on("close", resolve)
    })
}
