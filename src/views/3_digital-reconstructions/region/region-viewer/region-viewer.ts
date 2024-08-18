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

const AMBIENT_LIGHT_COLOR = 0x555555;
const CAMERA_LIGHT_COLOR = 0xcacaca;
const BACKGROUND_COLOR = 0xfefdfb;

function parseCssColor(colorStr: string) {
  return parseInt(colorStr.replace('#', ''), 16);
}

export default class VolumeViewer {
  private meshPath: string | null = null;
  private volumeSection: VolumeSection | null = null;

  private container: HTMLDivElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private renderer: WebGLRenderer | null = null;
  private scene: Scene | null = null;
  private camera: PerspectiveCamera | null = null;
  private controls: TrackballControls | null = null;
  private ctrl: RendererCtrl = new RendererCtrl();
  private onUserInteract: EventListener = () => { };

  private material: Record<string, Material> = {};
  private group: Group | null = null;
  private layerMesh: { [meshName: string]: Mesh } = {};

  constructor(container: HTMLDivElement) {
    this.container = container;
  }

  public async init(meshPath: string, volumeSection: VolumeSection) {
    try {
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

      this.ctrl.renderOnce();
      this.startRenderLoop();
    } catch (error) {
      //console.error('Error initializing VolumeViewer:', error);
    }
  }

  public resize() {
    const { clientWidth, clientHeight } = this.container!;
    this.camera!.aspect = clientWidth / clientHeight;
    this.camera!.updateProjectionMatrix();
    this.renderer!.setSize(clientWidth, clientHeight);

    this.ctrl.renderOnce();
  }

  public setVolumeSection(volumeSection: VolumeSection, visibility: Record<string, boolean>) {
    this.volumeSection = volumeSection;

    //console.log(`Volume section changed to: ${volumeSection}`);
    //console.log('Current layer visibility:');

    Object.entries(this.layerMesh).forEach(([meshName, mesh]) => {
      if (meshName === 'region') {
        mesh.visible = true;
      } else {
        const layerType = meshName.replace('neurons_', '');
        mesh.visible = layerType === volumeSection && visibility[layerType];
      }
      //console.log(`  ${meshName}: ${mesh.visible ? 'visible' : 'hidden'}`);
    });

    this.ctrl.renderOnce();
  }

  public setLayerVisibility(visibility: Record<string, boolean>) {
    //console.log('Layer visibility changed:');

    Object.entries(visibility).forEach(([layer, visible]) => {
      if (layer === 'region') {
        this.layerMesh['region'].visible = true;
        //console.log(`  region: always visible`);
      } else {
        const meshKey = `neurons_${layer}`;
        if (this.layerMesh[meshKey]) {
          this.layerMesh[meshKey].visible = (layer === this.volumeSection) && visible;
          //console.log(`  ${meshKey}: ${this.layerMesh[meshKey].visible ? 'visible' : 'hidden'}`);
        } else {
          //console.warn(`  Mesh for ${meshKey} is not found`);
        }
      }
    });

    this.ctrl.renderOnce();
  }

  public downloadRender(filename: string) {
    const { clientWidth, clientHeight } = this.renderer!.domElement.parentElement!;

    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      physicallyCorrectColors: true,
    });

    renderer.setSize(clientWidth * 3, clientHeight * 3);

    renderer.render(this.scene!, this.camera!);

    renderer.domElement.toBlob(blob => saveAs(blob!, `${filename}.png`));
    renderer.dispose();
  }

  public destroy() {
    Object.values(this.material).forEach(material => material.dispose());
    Object.values(this.layerMesh).forEach(mesh => mesh.geometry.dispose());

    if (this.renderer) {
      this.renderer.domElement.removeEventListener('wheel', this.onUserInteract);
      this.renderer.domElement.removeEventListener('mousemove', this.onUserInteract);
      this.renderer.domElement.removeEventListener('touchmove', this.onUserInteract);
      this.renderer.domElement.removeEventListener('pointermove', this.onUserInteract);
    }

    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.container!);
    }

    if (this.controls) {
      this.controls.dispose();
    }
    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.container && this.canvas) {
      this.container.removeChild(this.canvas);
    }
  }

  private initCanvas() {
    this.canvas = document.createElement('canvas');
    this.container!.appendChild(this.canvas);
  }

  private initRenderer() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas!,
      antialias: true,
    });

    const { clientWidth, clientHeight } = this.container!;
    this.renderer.setSize(clientWidth, clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
  }

  private initScene() {
    this.scene = new Scene();
    this.scene.background = new Color("#EFF1F8");
    this.scene.add(new AmbientLight(AMBIENT_LIGHT_COLOR));
  }

  private initCamera() {
    const { clientWidth, clientHeight } = this.container!;
    this.camera = new PerspectiveCamera(45, clientWidth / clientHeight, 1, 30000);
    this.scene!.add(this.camera);
    this.camera.add(new PointLight(CAMERA_LIGHT_COLOR, 0.9));
  }

  private initControls() {
    this.controls = new TrackballControls(this.camera!, this.renderer!.domElement);
    this.controls.enableDamping = true;
    this.controls.zoomSpeed = 0.5;
    this.controls.rotateSpeed = 0.8;
    this.controls.maxDistance = 20000;
  }

  private initEvents() {
    const params = { capture: false, passive: true };

    this.onUserInteract = throttle(() => this.ctrl.renderFor(4000), 100).bind(this);

    this.canvas!.addEventListener('wheel', this.onUserInteract, params);
    this.canvas!.addEventListener('mousemove', this.onUserInteract, params);
    this.canvas!.addEventListener('touchmove', this.onUserInteract, params);
    this.canvas!.addEventListener('pointermove', this.onUserInteract, params);
  }

  private initObservers() {
    this.resizeObserver = new ResizeObserver(() => setTimeout(() => this.resize(), 0));
    this.resizeObserver.observe(this.container!);
  }

  private initMaterials() {
    this.material = {
      region: new MeshLambertMaterial({
        color: parseCssColor("black"),
        wireframe: true,
        transparent: true,
        opacity: 0.1,
      }),
      neurons: new MeshLambertMaterial({ color: parseCssColor("#3b4165") }),
      cylinder: new MeshLambertMaterial({ color: parseCssColor("#3b4165") }),
      slice: new MeshLambertMaterial({ color: parseCssColor("#3b4165") }),
    }
  }

  private initMeshes() {
    const loader = new OBJLoader();

    return new Promise<void>((resolve) => {
      loader.load(this.meshPath!, (obj) => {
        obj.traverse(mesh => {
          if (!mesh.isMesh) return;

          const { name } = mesh;

          if (name === 'region') {
            mesh.material = this.material.region;
            mesh.visible = true;
          } else if (name === 'neurons_region') {
            mesh.material = this.material.neurons;
            mesh.visible = this.volumeSection === 'region';
          } else {
            const layerType = name.replace('neurons_', '');
            mesh.material = this.material[layerType];
            mesh.visible = name.includes(this.volumeSection!);
          }
          this.layerMesh[name] = mesh;
        });

        this.scene!.add(obj);
        this.group = obj;
        resolve();
      });
    });
  }

  private alignCamera() {
    const boundingBox = new Box3().setFromObject(this.group!);

    const centerVec = new Vector3();
    boundingBox.getCenter(centerVec);

    const sizeVec = new Vector3();
    boundingBox.getSize(sizeVec);

    const size = sizeVec.x;

    this.camera!.position.z = centerVec.z;
    this.camera!.position.y = centerVec.y;

    const distance = size / Math.tan(Math.PI * this.camera!.fov / 360) * 1.15;

    this.camera!.position.x = centerVec.x - distance;
    this.controls!.target = centerVec;

    this.controls!.update();
  }

  private startRenderLoop() {
    if (this.ctrl.stopped) return;

    if (!this.renderer || !this.scene || !this.camera || !this.controls) {
      console.warn('Renderer, scene, camera, or controls not initialized. Stopping render loop.');
      return;
    }

    if (this.ctrl.render) {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }

    requestAnimationFrame(this.startRenderLoop.bind(this));
  }
}