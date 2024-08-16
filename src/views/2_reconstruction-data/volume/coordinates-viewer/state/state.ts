// state.ts
import AtomicState from "./atomic-state";

function isString(data: unknown): data is string {
    return typeof data === "string";
}

const State = {
    axe: new AtomicState<string>("L", {
        storage: { id: "axe", guard: isString },
    }),
};

export default State;