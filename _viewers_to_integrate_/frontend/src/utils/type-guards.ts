export type TypeDef =
    | "boolean"
    | "null"
    | "undefined"
    | "string"
    | "number"
    | "function"
    | "unknown"
    | "function"
    | ["string", { min?: number; max?: number }]
    | ["number", { min?: number; max?: number }]
    | ["|", ...TypeDef[]]
    | ["?", TypeDef]
    | ["array", TypeDef]
    | [`array(${number})`, TypeDef]
    | ["map", TypeDef]
    | { [name: string]: TypeDef }

export function assertType<T>(
    data: unknown,
    type: TypeDef,
    prefix = "data"
): asserts data is T {
    if (type === "unknown") return

    if (type === "null") {
        if (data !== null) {
            throw Error(
                `Expected ${prefix} to be null and not a ${typeof data}!`
            )
        }
        return
    }

    if (typeof type === "string") {
        if (typeof data !== type) {
            throw Error(
                `Expected ${prefix} to be a string and not a ${typeof data}!`
            )
        }
        return
    }
    if (Array.isArray(type)) {
        const [kind] = type
        switch (kind) {
            case "array":
                assertTypeArray(data, prefix, type)
                return
            case "map":
                assertTypeMap(data, prefix, type)
                return
            case "?":
                assertTypeOptional(data, prefix, type)
                return
            case "|":
                assertTypeAlternative(data, prefix, type)
                return
            default:
                if (kind.startsWith("array(")) {
                    const size = parseInt(
                        kind.substring("array(".length, kind.length - 1),
                        10
                    )
                    assertTypeArrayWithDimension(
                        data,
                        prefix,
                        type as [unknown, TypeDef],
                        size
                    )
                    return
                }
                throw Error(
                    `Don't know how to create a type guard for this kind of type: ${JSON.stringify(
                        type
                    )}`
                )
        }
    }

    if (typeof data !== "object")
        throw Error(
            `Expected ${prefix} to be an object and not a ${typeof data}!`
        )

    const obj = data as { [key: string]: unknown }
    for (const name of Object.keys(type)) {
        if (typeof name !== "string") continue

        const objType = type[name]
        if (objType) assertType(obj[name], type[name], `${prefix}.${name}`)
    }
}

function assertTypeArrayWithDimension(
    data: unknown,
    prefix: string,
    type: [unknown, TypeDef],
    size: number
) {
    if (!Array.isArray(data))
        throw Error(
            `Expected ${prefix} to be an array and not a ${typeof data}!`
        )
    if (data.length !== size)
        throw Error(
            `${prefix} was expected to have a length of ${size}, but we got ${data.length}!`
        )
    const [, subType] = type
    for (let i = 0; i < data.length; i += 1) {
        assertType(data[i], subType, `${prefix}[${i}]`)
    }
}

function assertTypeArray(
    data: unknown,
    prefix: string,
    type: ["array", TypeDef]
) {
    if (!Array.isArray(data))
        throw Error(
            `Expected ${prefix} to be an array and not a ${typeof data}!`
        )
    const [, subType] = type
    for (let i = 0; i < data.length; i += 1) {
        assertType(data[i], subType, `${prefix}[${i}]`)
    }
}

function assertTypeMap(data: unknown, prefix: string, type: ["map", TypeDef]) {
    if (!isObject(data))
        throw Error(
            `Expected ${prefix} to be an object and not a ${typeof data}!`
        )
    const [, subType] = type
    for (const key of Object.keys(data)) {
        if (typeof key === "string") {
            assertType(data[key], subType, `${prefix}[${key}]`)
        }
    }
}

function assertTypeOptional(
    data: unknown,
    prefix: string,
    type: ["?", TypeDef]
) {
    if (typeof data === "undefined") return

    const [, optionalType] = type
    assertType(data, optionalType, prefix)
}

function assertTypeAlternative(
    data: unknown,
    prefix: string,
    type: ["|", ...TypeDef[]]
) {
    const [, ...altTypes] = type
    let lastException = Error(
        `No type has been defined for this alternative: ${JSON.stringify(
            type
        )}!`
    )
    for (const altType of altTypes) {
        try {
            assertType(data, altType, prefix)
            return
        } catch (ex) {
            if (ex instanceof Error) lastException = ex
        }
    }
    throw lastException
}

function isObject(data: unknown): data is { [key: string]: unknown } {
    if (!data) return false
    if (Array.isArray(data)) return false
    return typeof data === "object"
}
