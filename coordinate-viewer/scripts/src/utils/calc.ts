const EPSILON = 1e-12

export type Vector3 = [x: number, y: number, z: number]
export type Quaternion = [x: number, y: number, z: number, w: number]
export type Vector = Vector3 | Quaternion

export function isZero(x: number) {
    return Math.abs(x) < EPSILON
}

export function project(vector: Vector3, base: Vector3): number {
    const [vx, vy, vz] = vector
    const [bx, by, bz] = base
    const coeff = 1 / (bx * bx + by * by + bz * bz)
    return coeff * (vx * bx + vy * by + vz * bz)
}

export function vectorSquareLength(vec: number[]): number {
    return vec.reduce(
        (previousValue: number, currentValue: number) =>
            previousValue + currentValue * currentValue,
        0
    )
}

export function vectorLength(vec: number[]): number {
    return Math.sqrt(vectorSquareLength(vec))
}

export function normalize<T extends Vector>(vec: T): T {
    const result: T = [...vec]
    const squareLength = vectorSquareLength(vec)
    if (squareLength < EPSILON) {
        return result
    }

    const length = Math.sqrt(squareLength)
    return result.map(v => v / length) as T
}

export function subtractVectors(a: Vector3, b: Vector3): Vector3 {
    const [ax, ay, az] = a
    const [bx, by, bz] = b
    return [ax - bx, ay - by, az - bz]
}

export function addVectors(...vectors: Vector3[]): Vector3 {
    const [vector, ...rest] = vectors
    let [x, y, z] = vector
    for (const [xx, yy, zz] of rest) {
        x += xx
        y += yy
        z += zz
    }
    return [x, y, z]
}

export function scaleVector(v: Vector3, scale: number): Vector3 {
    const [x, y, z] = v
    return [scale * x, scale * y, scale * z]
}

export function computeBoundingBox(points: Vector3[]) {
    const [[x, y, z], ...rest] = points
    let minX = x
    let maxX = x
    let minY = y
    let maxY = y
    let minZ = z
    let maxZ = z
    for (const [xx, yy, zz] of rest) {
        minX = Math.min(minX, xx)
        maxX = Math.max(maxX, xx)
        minY = Math.min(minY, yy)
        maxY = Math.max(maxY, yy)
        minZ = Math.min(minZ, zz)
        maxZ = Math.max(maxZ, zz)
    }
    return {
        minX,
        maxX,
        minY,
        maxY,
        minZ,
        maxZ,
    }
}

export function crossProduct(vecA: Vector3, vecB: Vector3): Vector3 {
    const [xa, ya, za] = vecA
    const [xb, yb, zb] = vecB
    return [ya * zb - yb * za, xb * za - xa * zb, xa * yb - xb * ya]
}
