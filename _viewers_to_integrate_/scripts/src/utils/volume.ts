import {
    Vector3,
    addVectors,
    project,
    scaleVector,
    subtractVectors,
} from "./calc.js"
import VolumeHeader from "./header.js"

export default class Volume {
    public attributesSizeInBytes = 0

    private readonly dataLength: number
    private readonly typeLength: number
    private readonly view: DataView
    private readonly read: (index: number) => number

    /**
     * @param data Uncompressed data.
     */
    constructor(public readonly header: VolumeHeader, data: ArrayBuffer) {
        this.view = new DataView(data)
        switch (header.type) {
            case "int8":
            case "int8_t":
            case "signed char":
                this.typeLength = 1
                this.read = this.readInt8
                break
            case "int16":
            case "int16_t":
            case "short":
            case "short int":
            case "signed short":
            case "signed short int":
                this.typeLength = 2
                this.read =
                    header.endian === "little"
                        ? this.readInt16LittleEndian
                        : this.readInt16BigEndian
                break
            case "int32":
            case "int32_t":
            case "int":
            case "signed int":
                this.typeLength = 4
                this.read =
                    header.endian === "little"
                        ? this.readInt32LittleEndian
                        : this.readInt32BigEndian
                break
            case "float":
                this.typeLength = 4
                this.read =
                    header.endian === "little"
                        ? this.readFloat32LittleEndian
                        : this.readFloat32BigEndian
                break
            case "double":
                this.typeLength = 8
                this.read =
                    header.endian === "little"
                        ? this.readFloat64LittleEndian
                        : this.readFloat64BigEndian
                break
            default:
                throw Error(
                    `Don't know how to deal with type "${header.type}"!\nWe only know "int8", "int16", "int32", "float" and "double".`
                )
        }
        this.dataLength = data.byteLength
    }

    public getCoords(point: Vector3): Vector3 {
        const vector = subtractVectors(point, this.header.spaceOrigin)
        const axis = this.header.spaceAxis
        const { x: cellsX, y: cellsY, z: cellsZ } = this.header.sizes
        const x = project(vector, axis.x)
        const xInt = Math.floor(x)
        if (x < 0 || x >= cellsX)
            throw Error(`Point (${point.join(", ")}) is out of the volume!`)
        const y = project(vector, axis.y)
        const yInt = Math.floor(y)
        if (y < 0 || y >= cellsY)
            throw Error(`Point (${point.join(", ")}) is out of the volume!`)
        const z = project(vector, axis.z)
        const zInt = Math.floor(z)
        if (z < 0 || z >= cellsZ)
            throw Error(`Point (${point.join(", ")}) is out of the volume!`)
        let voxel = this.getVoxel(xInt, yInt, zInt)
        if (!voxel) return [-1, -1, -1]

        const xx = x - xInt - 0.5
        const xShift = xx < 0 ? -1 : +1
        const xWeight = 1 - Math.abs(xx)
        const yy = y - yInt - 0.5
        const yShift = yy < 0 ? -1 : +1
        const yWeight = 1 - Math.abs(yy)
        const zz = z - zInt - 0.5
        const zShift = zz < 0 ? -1 : +1
        const zWeight = 1 - Math.abs(zz)

        const v100 = this.getVoxel(
            xInt + xShift * 1,
            yInt + yShift * 0,
            zInt + zShift * 0
        )
        const v010 = this.getVoxel(
            xInt + xShift * 0,
            yInt + yShift * 1,
            zInt + zShift * 0
        )
        const v110 = this.getVoxel(
            xInt + xShift * 1,
            yInt + yShift * 1,
            zInt + zShift * 0
        )
        const v001 = this.getVoxel(
            xInt + xShift * 0,
            yInt + yShift * 0,
            zInt + zShift * 1
        )
        const v101 = this.getVoxel(
            xInt + xShift * 1,
            yInt + yShift * 0,
            zInt + zShift * 1
        )
        const v011 = this.getVoxel(
            xInt + xShift * 0,
            yInt + yShift * 1,
            zInt + zShift * 1
        )
        const v111 = this.getVoxel(
            xInt + xShift * 1,
            yInt + yShift * 1,
            zInt + zShift * 1
        )
        return this.average8(
            voxel,
            v100,
            v010,
            v110,
            v001,
            v101,
            v011,
            v111,
            xWeight,
            yWeight,
            zWeight
        )
    }

    private average8(
        v000: Vector3,
        v100: Vector3 | null,
        v010: Vector3 | null,
        v110: Vector3 | null,
        v001: Vector3 | null,
        v101: Vector3 | null,
        v011: Vector3 | null,
        v111: Vector3 | null,
        xWeight: number,
        yWeight: number,
        zWeight: number
    ): Vector3 {
        return this.average2(
            this.average2(
                this.average2(v000, v100, xWeight),
                this.average2(v010, v110, xWeight),
                yWeight
            ),
            this.average2(
                this.average2(v001, v101, xWeight),
                this.average2(v011, v111, xWeight),
                yWeight
            ),
            zWeight
        )
    }

    private average2(
        v0: Vector3 | null,
        v1: Vector3 | null,
        weight: number
    ): Vector3 | null {
        if (!v0) return v1
        if (!v1) return v0

        return addVectors(scaleVector(v0, weight), scaleVector(v1, 1 - weight))
    }

    private getVoxel(xInt: number, yInt: number, zInt: number): Vector3 | null {
        const { sizes } = this.header
        const index =
            this.typeLength *
            (sizes.value * (xInt + sizes.x * (yInt + sizes.y * zInt)))
        const x = this.read(index)
        if (x < -0.9) return null

        const y = this.read(index + this.typeLength)
        const z = this.read(index + 2 * this.typeLength)
        return [x, y, z]
    }

    private readonly readInt8 = (offset: number): number =>
        this.view.getInt8(offset)

    private readonly readInt16LittleEndian = (offset: number): number =>
        this.view.getInt16(offset, true)

    private readonly readInt16BigEndian = (offset: number): number =>
        this.view.getInt16(offset, false)

    private readonly readInt32LittleEndian = (offset: number): number =>
        this.view.getInt32(offset, true)

    private readonly readInt32BigEndian = (offset: number): number =>
        this.view.getInt32(offset, false)

    private readonly readFloat32LittleEndian = (offset: number): number =>
        this.view.getFloat32(offset, true)

    private readonly readFloat32BigEndian = (offset: number): number =>
        this.view.getFloat32(offset, false)

    private readonly readFloat64LittleEndian = (offset: number): number =>
        this.view.getFloat64(offset, true)

    private readonly readFloat64BigEndian = (offset: number): number =>
        this.view.getFloat64(offset, false)
}
