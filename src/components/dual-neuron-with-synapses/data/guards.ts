export function isObject(data: unknown): data is Record<string, unknown> {
  if (!data) return false;
  if (Array.isArray(data)) return false;
  return typeof data === "object";
}

export function isString(data: unknown): data is string {
  return typeof data === "string";
}

export function isNumber(data: unknown): data is number {
  return typeof data === "number";
}

export function isBoolean(data: unknown): data is boolean {
  return typeof data === "boolean";
}

export function isArrayBuffer(data: unknown): data is ArrayBuffer {
  if (!data) return false;
  return data instanceof ArrayBuffer;
}

export function isStringArray(data: unknown): data is string[] {
  if (!Array.isArray(data)) return false;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of data) {
    if (!isString(item)) return false;
  }
  return true;
}

export function assertNumber(
  data: unknown,
  name = "data"
): asserts data is number {
  if (!isNumber(data)) {
    throw Error(
      `${name} was expected to be a number but we got ${typeof data}!`
    );
  }
}

export function assertString(
  data: unknown,
  name = "data"
): asserts data is string {
  if (!isString(data)) {
    throw Error(
      `${name} was expected to be a string but we got ${typeof data}!`
    );
  }
}

export function assertOptionalString(
  data: unknown,
  name = "data"
): asserts data is string | undefined {
  if (data && !isString(data)) {
    throw Error(
      `${name} was expected to be a string but we got ${typeof data}!`
    );
  }
}

export function assertBoolean(
  data: unknown,
  name = "data"
): asserts data is boolean {
  if (!isBoolean(data)) {
    throw Error(
      `${name} was expected to be a boolean but we got ${typeof data}!`
    );
  }
}

export function assertObject(
  data: unknown,
  name = "data"
): asserts data is Record<string, unknown> {
  if (!isObject(data)) {
    throw Error(
      `${name} was expected to be an object but we got ${typeof data}!`
    );
  }
}

export function assertArray(
  data: unknown,
  name = "data"
): asserts data is unknown[] {
  if (!Array.isArray(data)) {
    throw Error(
      `${name} was expected to be an Array but we got ${typeof data}!`
    );
  }
}

export function assertArrayBuffer(
  data: unknown,
  name = "data"
): asserts data is ArrayBuffer {
  if (!isArrayBuffer(data)) {
    throw Error(
      `${name} was expected to be an ArrayBuffer but we got ${typeof data}!`
    );
  }
}

export function assertOptionalArrayBuffer(
  data: unknown,
  name = "data"
): asserts data is ArrayBuffer | undefined {
  if (data && !isArrayBuffer(data)) {
    throw Error(
      `${name} was expected to be an ArrayBuffer but we got ${typeof data}!`
    );
  }
}

export type TypeDef =
  | "boolean"
  | "null"
  | "number"
  | "string"
  | "function"
  | "undefined"
  | "unknown"
  | ["number", { min?: number; max?: number }]
  | ["|", ...TypeDef[]]
  | ["?", TypeDef]
  | ["array", TypeDef]
  | [`array(${number})`, TypeDef]
  | ["map", TypeDef]
  | ["tuple", ...TypeDef[]]
  | ["literal", ...string[]]
  | ["partial", { [name: string]: TypeDef }]
  | { [name: string]: TypeDef };

export function isType<T>(data: unknown, type: TypeDef): data is T {
  try {
    assertType<T>(data, type);
    return true;
  } catch (ex) {
    return false;
  }
}

export function assertType<T>(
  data: unknown,
  type: TypeDef,
  prefix = "data"
): asserts data is T {
  if (type === "unknown") return;

  if (type === "null") {
    if (data !== null) {
      throw Error(`Expected ${prefix} to be null and not a ${typeof data}!`);
    }
    return;
  }
  if (typeof type === "string") {
    if (typeof data !== type) {
      throw Error(
        `Expected ${prefix} to be a ${type} and not a ${typeof data}!`
      );
    }
    return;
  }
  if (Array.isArray(type)) {
    const [kind] = type;
    switch (kind) {
      case "array":
        assertTypeArray(data, prefix, type);
        return;
      case "map":
        assertTypeMap(data, prefix, type);
        return;
      case "?":
        assertTypeOptional(data, prefix, type);
        return;
      case "|":
        assertTypeAlternative(data, prefix, type);
        return;
      case "tuple":
        assertTypeTuple(data, prefix, type);
        return;
      case "partial":
        assertTypePartial(data, prefix, type);
        return;
      case "literal":
        assertTypeLiteral(data, prefix, type);
        return;
      default:
        if (kind.startsWith("array(")) {
          const size = parseInt(
            kind.substring("array(".length, kind.length - 1),
            10
          );
          assertTypeArrayWithDimension(
            data,
            prefix,
            type as [unknown, TypeDef],
            size
          );
          return;
        }
        throw Error(
          `Don't know how to create a type guard for this kind of type: ${JSON.stringify(
            type
          )}`
        );
    }
  }

  if (typeof data !== "object")
    throw Error(`Expected ${prefix} to be an object and not a ${typeof data}!`);

  const obj = data as { [key: string]: unknown };
  for (const name of Object.keys(type)) {
    if (typeof name !== "string") continue;

    assertType(obj[name], type[name], `${prefix}.${name}`);
  }
}

function assertTypeTuple(
  data: unknown,
  prefix: string,
  [, ...types]: ["tuple", ...TypeDef[]]
) {
  assertArray(data);
  if (types.length !== data.length) {
    throw Error(
      `Expected ${prefix} to have ${types.length} elements, not ${data.length}!`
    );
  }
  for (let i = 0; i < types.length; i++) {
    const type: TypeDef = types[i] as TypeDef;
    assertType(data[i], type, `${prefix}[$i]`);
  }
}

function assertTypePartial(
  data: unknown,
  prefix: string,
  [, type]: ["partial", { [name: string]: TypeDef }]
) {
  assertObject(data, prefix);
  for (const name of Object.keys(type)) {
    if (typeof name !== "string") continue;

    const attrib: unknown = data[name];
    if (typeof attrib !== "undefined") {
      assertType(attrib, type[name], `${prefix}.${name}`);
    }
  }
}

function assertTypeArray(
  data: unknown,
  prefix: string,
  type: ["array", TypeDef]
) {
  if (!Array.isArray(data))
    throw Error(`Expected ${prefix} to be an array and not a ${typeof data}!`);
  const [, subType] = type;
  for (let i = 0; i < data.length; i += 1) {
    assertType(data[i], subType, `${prefix}[${i}]`);
  }
}

function assertTypeArrayWithDimension(
  data: unknown,
  prefix: string,
  type: [unknown, TypeDef],
  size: number
) {
  if (!Array.isArray(data))
    throw Error(`Expected ${prefix} to be an array and not a ${typeof data}!`);
  if (data.length !== size)
    throw Error(
      `${prefix} was expected to have a length of ${size}, but we got ${data.length}!`
    );
  const [, subType] = type;
  for (let i = 0; i < data.length; i += 1) {
    assertType(data[i], subType, `${prefix}[${i}]`);
  }
}

function assertTypeMap(data: unknown, prefix: string, type: ["map", TypeDef]) {
  if (!isObject(data))
    throw Error(`Expected ${prefix} to be an object and not a ${typeof data}!`);
  const [, subType] = type;
  for (const key of Object.keys(data)) {
    if (typeof key === "string") {
      assertType(data[key], subType, `${prefix}[${key}]`);
    }
  }
}

function assertTypeOptional(
  data: unknown,
  prefix: string,
  type: ["?", TypeDef]
) {
  if (typeof data === "undefined") return;

  const [, optionalType] = type;
  assertType(data, optionalType, prefix);
}

function assertTypeAlternative(
  data: unknown,
  prefix: string,
  type: ["|", ...TypeDef[]]
) {
  const [, ...altTypes] = type;
  let lastException = Error(
    `No type has been defined for this alternative: ${JSON.stringify(type)}!`
  );
  for (const altType of altTypes) {
    try {
      assertType(data, altType, prefix);
      return;
    } catch (ex) {
      if (ex instanceof Error) lastException = ex;
    }
  }
  throw lastException;
}

function assertTypeLiteral(
  data: unknown,
  prefix: string,
  type: ["literal", ...string[]]
) {
  const [, ...literals] = type;
  for (const literal of literals) {
    if (data === literal) return;
  }
  throw Error(
    `Expected ${prefix} to be a literal (${literals
      .map((item) => `"${item}"`)
      .join(" | ")})!`
  );
}

/**
 * Basically, this function checks a `data` against a `type` and returns a `defaultValue`
 * if `data` is not of the expected type.
 *
 * But if the `defaultValue` is a function returning the expected `type`, then `ensureType`
 * can be use to update old data that you have retrieved from local storage, for example.
 *
 * @example
 * ```
 * interface Complex { r: number, i: number }
 * const complex = ensureType<Complex>(data, {r: "number", i: "number"}, { r: 1, i: 0 })
 * ```
 *
 * @example
 * ```
 * interpace PersonVersion1 {
 *   name: string
 *   female: boolean
 * }
 * interpace PersonVersion2 {
 *   name: string
 *   gender: "male" | "female" | "nonbinary" | "unknown"
 * }
 *
 * const data = JSON.parse(LocalStorate.getItem("person") ?? "null")
 * const TypePersonVersion1 = {
 *   name: "string",
 *   female: "boolean"
 * }
 * const TypePersonVersion2 = {
 *   name: "string",
 *   gender: ["literal", "male", "female", "nonbinary", "unknown"]
 * }
 * const person = ensureType<PersonVersion2>(
 *   data,
 *   TypePersonVersion2,
 *   (value: unknown) => {
 *     if (isType<PersonVersion2>(value, TypePersonVersion2)) {
 *       return value
 *     }
 *     if (isType<PersonVersion1>(value, TypePersonVersion1)) {
 *       return {
 *         name: value.name,
 *         gender: value.female === true ? "female" : "unknown"
 *       }
 *     }
 *     return { name: "Anonymous", gender: "unknown" }
 *   }
 * )
 * ```
 *
 * @param data Value with unknown type.
 * @param type The type to check against.
 * @param defaultValue If the type doesn't check, we can return `defaultValue`, or call it if this is a function.
 * @returns A value that is of the expected type.
 */
export function ensureType<T>(
  data: unknown,
  type: TypeDef,
  defaultValue: T | ((v: unknown) => T)
): T {
  if (isType<T>(data, type)) return data;

  return isType<T>(defaultValue, type) ? defaultValue : defaultValue(data);
}
