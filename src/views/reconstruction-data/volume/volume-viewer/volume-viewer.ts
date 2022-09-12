import throttle from 'lodash/throttle';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import {
  AmbientLight,
  Box3,
  Color,
  DoubleSide,
  Group,
  Material,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three';

import { Layer, VolumeSection } from '@/types';

import { RendererCtrl } from './utils';
import { saveAs } from 'file-saver';
import { color } from './constants';


const AMBIENT_LIGHT_COLOR = 0x555555;
const CAMERA_LIGHT_COLOR = 0xcacaca;

const BACKGROUND_COLOR = 0xfefdfb;

function parseCssColor(colorStr) {
  return parseInt(colorStr.replace('#', ''), 16);
}

export default class VolumeViewer {
  private meshPath: string = null;
  private volumeSection: VolumeSection = null;

  private container: HTMLDivElement = null;
  private resizeObserver: ResizeObserver = null;
  private canvas: HTMLCanvasElement = null;
  private renderer: WebGLRenderer = null;
  private scene: Scene = null;
  private camera: PerspectiveCamera = null;
  private controls: TrackballControls = null;
  private ctrl: RendererCtrl = new RendererCtrl();
  private onUserInteract: EventListener = null;

  private material: Record<string, Material> = {};
  private regionMesh: Mesh = null;
  private group: Group = null;
  private layerMesh: { [meshName: string]: Mesh } = {};

  private regionMeshVisible = true;

  constructor(container: HTMLDivElement) {
    this.container = container;
  }

  public async init(meshPath: string, volumeSection: VolumeSection) {
    this.meshPath = meshPath;
    this.volumeSection = volumeSection;

    this.initCanvas();
    this.initRenderer();
    this.initScene();
    this.initCamera();
    this.initControls();
    this.initEvents();
    this.initObservers();

    this.initMaterials();

    await this.initMeshes();

    this.alignCamera();

    this.startRenderLoop();
    this.ctrl.renderOnce();
  }

  public resize() {
    const { clientWidth, clientHeight } = this.container;
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight);

    this.ctrl.renderOnce();
  }

  public setVolumeSection(volumeSection: VolumeSection, visibility: Record<Layer, boolean>) {
    this.volumeSection = volumeSection;

    Object.entries(this.layerMesh).forEach(([meshKey, mesh]) => {
      const [, meshVolumeSection, layer] = meshKey.match(/(\w+)\_(\w+)/);
      mesh.visible = meshVolumeSection === volumeSection && visibility[layer];
    });

    if (this.regionMesh) {
      this.regionMesh.visible = this.regionMeshVisible && this.canRenderRegionMesh();
    }

    this.ctrl.renderOnce();
  }

  public setRegionMaskVisibility(visible) {
    this.regionMeshVisible = visible;
    this.regionMesh.visible = visible && this.canRenderRegionMesh();
    this.ctrl.renderOnce();
  }

  public setLayerVisibility(visibility) {
    Object.entries(visibility).forEach(([layer, visible]) => {
      const meshKey = `${this.volumeSection}_${layer}`;

      if(!this.layerMesh[meshKey]) {
        throw new Error(`Mesh for ${meshKey} is not found}`);
      }

      this.layerMesh[meshKey].visible = visible;
    });

    this.ctrl.renderOnce();
  }

  public downloadRender(filename) {
    const { clientWidth, clientHeight } = this.renderer.domElement.parentElement;

    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      physicallyCorrectColors: true,
    });

    renderer.setSize(clientWidth * 3, clientHeight * 3);

    renderer.render(this.scene, this.camera);

    renderer.domElement.toBlob(blob => saveAs(blob, `${filename}.png`));
    renderer.dispose();
  }

  public destroy() {
    Object.values(this.material).forEach(material => material.dispose());
    Object.values(this.layerMesh).forEach(mesh => mesh.geometry.dispose());

    this.regionMesh.geometry.dispose();

    this.renderer.domElement.removeEventListener('wheel', this.onUserInteract);
    this.renderer.domElement.removeEventListener('mousemove', this.onUserInteract);
    this.renderer.domElement.removeEventListener('touchmove', this.onUserInteract);
    this.renderer.domElement.removeEventListener('pointermove', this.onUserInteract);

    this.resizeObserver.unobserve(this.container);

    this.controls.dispose();
    this.renderer.dispose();

    this.container.removeChild(this.canvas);
  }

  private initCanvas() {
    this.canvas = document.createElement('canvas');
    this.container.appendChild(this.canvas);
  }

  private initRenderer() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    const { clientWidth, clientHeight } = this.container;
    this.renderer.setSize(clientWidth, clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
  }

  private initScene() {
    this.scene = new Scene();
    this.scene.background = new Color(BACKGROUND_COLOR);
    this.scene.add(new AmbientLight(AMBIENT_LIGHT_COLOR));
  }

  private initCamera() {
    const { clientWidth, clientHeight } = this.container;
    this.camera = new PerspectiveCamera(45, clientWidth / clientHeight, 1, 30000);
    this.scene.add(this.camera);
    this.camera.add(new PointLight(CAMERA_LIGHT_COLOR, 0.9));
  }

  private initControls() {
    this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.zoomSpeed = 0.5;
    this.controls.rotateSpeed = 0.8;
    this.controls.maxDistance = 20000;
  }

  private initEvents() {
    const params  = { capture: false, passive: true };

    this.onUserInteract = throttle(() => this.ctrl.renderFor(4000), 100).bind(this);

    this.canvas.addEventListener('wheel', this.onUserInteract, params);
    this.canvas.addEventListener('mousemove', this.onUserInteract, params);
    this.canvas.addEventListener('touchmove', this.onUserInteract, params);
    this.canvas.addEventListener('pointermove', this.onUserInteract, params);
  }

  private initObservers() {
    this.resizeObserver = new ResizeObserver(() => this.resize());

    this.resizeObserver.observe(this.container);
  }

  private initMaterials() {
    this.material = {
      REGION: new MeshLambertMaterial({
        color: parseCssColor(color.REGION),
        wireframe: true,
        transparent: true,
        opacity: 0.1,
      }),

      SLM: new MeshLambertMaterial({ color: parseCssColor(color.SLM), side: DoubleSide }),
      SR: new MeshLambertMaterial({ color: parseCssColor(color.SR), side: DoubleSide }),
      SP: new MeshLambertMaterial({ color: parseCssColor(color.SP), side: DoubleSide }),
      SO: new MeshLambertMaterial({ color: parseCssColor(color.SO), side: DoubleSide }),
    }
  }

  private initMeshes() {
    const loader = new OBJLoader();

    return new Promise<void>((resolve) => {
      loader.load(this.meshPath, (obj) => {
        obj.traverse(mesh => {
          if (!mesh.isMesh) return;

          const { name } = mesh;

          if (name === 'region') {
            const material = this.material.REGION;

            mesh.material = material;
            mesh.visible = this.canRenderRegionMesh();

            this.regionMesh = mesh;
          } else {
            const [, volumeSection, layer] = name.match(/(\w+)_(\w+)/);

            const material = this.material[layer];
            mesh.material = material;
            mesh.visible = volumeSection === this.volumeSection;;

            this.layerMesh[`${volumeSection}_${layer}`] = mesh;
          }
        });

        this.scene.add(obj);
        this.group = obj;
        resolve();
      });
    });
  }

  private alignCamera() {
    const boundingBox = new Box3().setFromObject(this.group);

    const centerVec = new Vector3();
    boundingBox.getCenter(centerVec);

    const sizeVec = new Vector3();
    boundingBox.getSize(sizeVec);

    const size = sizeVec.x;

    this.camera.position.z = centerVec.z;
    this.camera.position.y = centerVec.y;

    const distance = size / Math.tan(Math.PI * this.camera.fov / 360) * 1.15;

    this.camera.position.x = centerVec.x - distance;
    this.controls.target = centerVec;

    this.controls.update();
  }

  private startRenderLoop() {
    if (this.ctrl.stopped) return;

    if (this.ctrl.render) {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }

    requestAnimationFrame(this.startRenderLoop.bind(this));
  }

  private canRenderRegionMesh() {
    return this.volumeSection !== 'region';
  }
}
