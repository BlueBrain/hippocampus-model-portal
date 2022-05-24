import { DoubleSide, SphereGeometry, Vector3, CylinderGeometry, MeshBasicMaterial, Mesh, MeshLambertMaterial, Object3D, PointLight, PerspectiveCamera, Fog, AmbientLight, Color, Scene, WebGLRenderer } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import chunk from 'lodash/chunk';

import { RendererCtrl, createSomaGeometryFromPoints, createSecGeometryFromPoints } from './utils';
import { Pool } from '@/services/threads';

const FOG_COLOR = 0xffffff;
const FOG_NEAR = 1;
const FOG_FAR = 50000;

const AMBIENT_LIGHT_COLOR = 0x555555;
const CAMERA_LIGHT_COLOR = 0xcacaca;

const BACKGROUND_COLOR = 0xfefdfb;
// const BACKGROUND_COLOR = 0x222222;

const secTypeMap = [
  'soma',
  'axon',
  'basal',
  'apical',
];

export default class ConnectionViewer {
  private data: any = null;

  private isDestroyed = false;
  private container: HTMLDivElement = null;
  private canvas: HTMLCanvasElement = null;
  private renderer: WebGLRenderer = null;
  private scene: Scene = null;
  private camera: PerspectiveCamera = null;
  private controls: TrackballControls = null;
  private ctrl: RendererCtrl = new RendererCtrl();

  private preMorphObj: Object3D = null;
  private postMorphObj: Object3D = null;
  private synapseObj: Object3D = null;

  private geometryWorkerPool: Pool = null;

  constructor(container: HTMLDivElement) {
    this.container = container;
  }

  async init(data: any) {
    if(this.isDestroyed) throw new Error(`Can't init already destroyed instance of ConnectionViewer `);

    this.data = data;

    this.initCanvas();
    this.initRenderer();
    this.initScene();
    this.initCamera();
    this.initControls();
    this.initObjects();
    this.initEvents();

    await this.initMorphologies();
    this.initSynapses();

    this.alignCamera();


    this.startRenderLoop();
  }

  private initCanvas() {
    this.canvas = document.createElement('canvas');
    this.container.appendChild(this.canvas);
  }

  private initRenderer() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });

    const { clientWidth, clientHeight } = this.container;
    this.renderer.setSize(clientWidth, clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
  }

  private initScene() {
    this.scene = new Scene();
    this.scene.background = new Color(BACKGROUND_COLOR);
    this.scene.fog = new Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);
    this.scene.add(new AmbientLight(AMBIENT_LIGHT_COLOR));
  }

  private initCamera() {
    const { clientWidth, clientHeight } = this.container;
    this.camera = new PerspectiveCamera(45, clientWidth / clientHeight, 1, 100000);
    this.scene.add(this.camera);
    this.camera.add(new PointLight(CAMERA_LIGHT_COLOR, 0.9));
  }

  private initControls() {
    this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.zoomSpeed = 0.4;
    this.controls.rotateSpeed = 0.8;
  }

  private initObjects() {
    this.preMorphObj = new Object3D();
    this.scene.add(this.preMorphObj);

    this.postMorphObj = new Object3D();
    this.scene.add(this.postMorphObj);

    this.synapseObj = new Object3D();
    this.scene.add(this.synapseObj);
  }

  private initEvents() {}

  private async initMorphologies() {
    const geometryWorkerFactory = () => new Worker(new URL('./workers/neuron-geometry.ts', import.meta.url), { name: 'geometry-worker'});
    this.geometryWorkerPool = new Pool(geometryWorkerFactory, 2);
    console.log('pool created');

    console.log('Awaiting for morpphologies to be added');
    const preMaterial = new MeshLambertMaterial({ color: 0x2d8cf0, side: DoubleSide });
    await this.addMorphology(this.data.pre.morph, preMaterial);

    const postMaterial = new MeshLambertMaterial({ color: 0xed4014, side: DoubleSide });
    await this.addMorphology(this.data.post.morph, postMaterial);

    console.log('Adding morphologies - done');

    this.geometryWorkerPool.terminate();
    this.geometryWorkerPool = null;
  }

  private async addMorphology(sections, material) {

    const createGeometries = sections.map(async section => {
      const secType = secTypeMap[section[0]];
      const secId = section[1];
      const isBaseSec = Boolean(section[2]);

      // if(!isBaseSec) return null;

      const ptsFlat = section.slice(-(section.length - 3));
      const pts = chunk(ptsFlat, 4);

      const geometry = secType === 'soma'
        ? await createSomaGeometryFromPoints(pts)
        : await createSecGeometryFromPoints(this.geometryWorkerPool, pts);

      return geometry
    });

    return Promise.all(createGeometries).then(geometries => {
      console.time('merge');
      const geometry = mergeBufferGeometries(geometries.filter(Boolean).filter(geometry => geometry.type === 'BufferGeometry'));
      console.timeEnd('merge');
      const mesh = new Mesh(geometry, material);
      this.preMorphObj.add(mesh);
    });
  }

  private initSynapses() {
    const geometries = this.data.synapses.map(synapse => {
      const geometry = new SphereGeometry(6, 32, 16);
      geometry.translate(...synapse.slice(0, 3));

      return geometry;
    });

    const geometry = mergeBufferGeometries(geometries);
    const material = new MeshLambertMaterial({ color: 0xffff00 });
    const synapsesMesh = new Mesh(geometry, material);

    this.synapseObj.add(synapsesMesh);
  }

  private alignCamera() {
    console.log('Align camera');
    const pts = this.data.pre.morph.find(section => secTypeMap[section[0]] === 'soma').slice(3, 7);
    const center = new Vector3(pts[0], pts[1], pts[2]);
    const radius = 50;

    this.camera.position.x = center.x;
    this.camera.position.y = center.y;

    const distance = radius / Math.tan(Math.PI * this.camera.fov / 360) * 1.15;

    this.camera.position.z = distance + center.z;
    this.controls.target = center;
    this.ctrl.renderFor(20000);
  }

  private startRenderLoop() {
    if (this.ctrl.render) {
      this.controls.update();
      // this.renderer.setRenderTarget(null);
      this.renderer.render(this.scene, this.camera);
    }
    requestAnimationFrame(this.startRenderLoop.bind(this));
  }

  destroy() {
    // TODO: implementation
    this.isDestroyed = true;
  }
}
