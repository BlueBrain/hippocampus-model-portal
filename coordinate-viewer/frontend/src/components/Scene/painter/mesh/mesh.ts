import FragmentShaderCode from "./shader.frag"
import VertexShaderCode from "./shader.vert"
import FragmentOutlineCode from "./shader-outline.frag"
import VertexOutlineCode from "./shader-outline.vert"
import {
    FrontSide as ThreeFrontSide,
    BackSide as ThreeBackSide,
    BufferGeometry as ThreeBufferGeometry,
    CanvasTexture as ThreeCanvasTexture,
    InterleavedBuffer as ThreeInterleavedBuffer,
    InterleavedBufferAttribute as ThreeInterleavedBufferAttribute,
    Group as ThreeGroup,
    Mesh as ThreeMesh,
    ShaderMaterial as ThreeShaderMaterial,
    Uniform as ThreeUniform,
    Vector3 as ThreeVector3,
} from "three"
import { getGradientCanvas } from "@/utils/gradient"

export function createMeshFromData(
    data: Float32Array,
    elem: number[]
): [ThreeGroup, (uniSelector: ThreeVector3) => void] {
    const texture = new ThreeCanvasTexture(getGradientCanvas())
    const geometry = new ThreeBufferGeometry()
    /**
     * 9 Float32 elements per vertex:
     *  - 3 for position
     *  - 3 for normal
     *  - 3 for coords
     */
    const interleavedBuffer = new ThreeInterleavedBuffer(data, 9)
    geometry.setIndex(elem)
    geometry.setAttribute(
        "position",
        new ThreeInterleavedBufferAttribute(interleavedBuffer, 3, 0, false)
    )
    geometry.setAttribute(
        "normal",
        new ThreeInterleavedBufferAttribute(interleavedBuffer, 3, 3, false)
    )
    geometry.setAttribute(
        "coords",
        new ThreeInterleavedBufferAttribute(interleavedBuffer, 3, 6, false)
    )
    // geometry.computeVertexNormals()
    const uniforms = {
        texCoords: {
            type: "t",
            value: texture,
        },
        uniSelector: { value: new ThreeVector3(0, 1, 0) },
    }
    const material = new ThreeShaderMaterial({
        uniforms,
        fragmentShader: FragmentShaderCode,
        vertexShader: VertexShaderCode,
        side: ThreeBackSide,
        depthTest: true,
    })
    texture.generateMipmaps = true
    texture.needsUpdate = true
    const group = new ThreeGroup()
    const mesh = new ThreeMesh(geometry, material)
    group.add(
        mesh,
        new ThreeMesh(
            geometry,
            new ThreeShaderMaterial({
                fragmentShader: FragmentOutlineCode,
                vertexShader: VertexOutlineCode,
                side: ThreeFrontSide,
                depthTest: true,
            })
        )
    )
    return [
        group,
        (uniSelector: ThreeVector3) => {
            material.uniforms.uniSelector.value = uniSelector
        },
    ]
}
