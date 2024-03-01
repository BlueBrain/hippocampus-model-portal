import AtomicState from "./atomic-state"

export default {
    axe: new AtomicState<string>("L", {
        storage: { id: "axe", guard: isString },
    }),
}

function isString(data: unknown): data is string {
    return typeof data === "string"
}
