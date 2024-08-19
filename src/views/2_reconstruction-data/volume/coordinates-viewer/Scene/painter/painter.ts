import State from "../../state"
import { Bounds, MeshInfo } from "../../types"
import { createMeshFromData } from "./mesh"
import {
    PerspectiveCamera as ThreePerspectiveCamera,
    Scene as ThreeScene,
    Vector3 as ThreeVector3,
    WebGLRenderer as ThreeWebGLRenderer,
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const Axes = {
    L: new ThreeVector3(1, 0, 0),
    T: new ThreeVector3(0, 1, 0),
    R: new ThreeVector3(0, 0, 1),
}

export default class Painter {
    public readonly scene: ThreeScene;
    public readonly camera: ThreePerspectiveCamera;
    public readonly renderer: ThreeWebGLRenderer;
    private readonly controls: OrbitControls;
    private lastWidth = 0;
    private lastHeight = 0;

    constructor(
        private readonly canvas: HTMLCanvasElement,
        meshInfo: MeshInfo,
        vert: Float32Array,
        elem: number[]
    ) {
        const scene = new ThreeScene();
        const camera = new ThreePerspectiveCamera(50, 1, 1, 1e5);
        const renderer = new ThreeWebGLRenderer({
            alpha: false,
            preserveDrawingBuffer: false,
            premultipliedAlpha: false,
            depth: true,
            canvas,
        });
        renderer.setClearColor(0x333333, 1);
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        renderer.setClearColor(0xEFF1F8, 1);

        const { x, y, z, sizeX, sizeY, sizeZ } = getSizeAndLocation(meshInfo);
        const controls = new OrbitControls(camera, canvas);
        this.controls = controls;
        controls.target.set(x, y, z);
        controls.addEventListener("change", this.paint);

        const [mesh, setUniSelector] = createMeshFromData(vert, elem);
        mesh.position.set(x, y, z);
        mesh.rotation.x = Math.PI; // Rotate the mesh by 180 degrees around the X-axis
        mesh.rotation.y = -Math.PI / 2; // Rotate the mesh by 180 degrees around the X-axis
        scene.add(mesh);

        camera.position.set(x, y, z - Math.max(sizeX, sizeY, sizeZ) * 1.5);
        camera.lookAt(new ThreeVector3(x, y, z));
        window.requestAnimationFrame(this.paint);

        State.axe.addListener((axe) => {
            setUniSelector(Axes[axe] ?? Axes.L);
            window.requestAnimationFrame(this.paint);
        });
    }

    public readonly paint = (_time: number) => {
        const { canvas, controls, camera, renderer, scene } = this;
        if (
            canvas.clientWidth !== this.lastWidth ||
            canvas.clientHeight !== this.lastHeight
        ) {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            this.lastWidth = w;
            this.lastHeight = h;
            canvas.width = w;
            canvas.height = h;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            camera.updateMatrix();
            renderer.setSize(w, h, false);
            controls.update();
        }
        renderer.render(scene, camera);
    }
}

function getSizeAndLocation(bounds: Bounds): {
    x: number;
    y: number;
    z: number;
    sizeX: number;
    sizeY: number;
    sizeZ: number;
} {
    const [minX, minY, minZ] = bounds.min;
    const [maxX, maxY, maxZ] = bounds.max;
    return {
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2,
        z: (minZ + maxZ) / 2,
        sizeX: maxX - minX,
        sizeY: maxY - minY,
        sizeZ: maxZ - minZ,
    };
}