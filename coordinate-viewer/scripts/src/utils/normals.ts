import {
    Vector3,
    addVectors,
    crossProduct,
    normalize,
    subtractVectors,
    vectorSquareLength,
} from "./calc.js"

export function computeNormals(
    points: Vector3[],
    triangles: number[]
): Vector3[] {
    console.log("Computing normals...")
    const normals: Vector3[] = points.map(() => [1e-6, 0, 0])
    for (let k = 0; k < triangles.length; k += 3) {
        const idxA = triangles[k + 0]
        const idxB = triangles[k + 1]
        const idxC = triangles[k + 2]
        const a = points[idxA]
        const b = points[idxB]
        const c = points[idxC]
        const ab = normalize(subtractVectors(b, a))
        const ac = normalize(subtractVectors(c, a))
        const normal = normalize(crossProduct(ab, ac))
        normals[idxA] = addVectors(normals[idxA], normal)
        normals[idxB] = addVectors(normals[idxB], normal)
        normals[idxC] = addVectors(normals[idxC], normal)
    }
    const result = normals.map(normalize)
    let bad = 0
    result.forEach(([x, y, z], index) => {
        try {
            if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(z)) {
                console.error("isNaN!!!")
                throw Error()
            }
            if (vectorSquareLength([x, y, z]) < 1e-6) throw Error()
        } catch (ex) {
            console.error(
                `Error in normal #${index}: ${[x, y, z]}`,
                vectorSquareLength([x, y, z])
            )
            bad++
        }
    })
    console.log(
        "Invalid normals:",
        ((100 * bad) / result.length).toFixed(2),
        "%"
    )
    return result
}
