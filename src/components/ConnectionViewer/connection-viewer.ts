import chunk from 'lodash/chunk';
import throttle from 'lodash/throttle';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import {
  AmbientLight,
  Color,
  DoubleSide,
  Fog,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer
} from 'three';

import {
  createSomaGeometryFromPoints,
  deserializeBufferGeometry,
  RendererCtrl,
} from './utils';
import { Pool } from '@/services/threads';
import { NeuriteType } from './constants';


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
  'dend',
  'dend',
];

const CellType = {
  PRE: 0,
  POST: 1,
}

type SectionPts = number[][];

type MorphologySecData = {
  [extendedSecType: string]: SectionPts[],
};

const material = {
  SOMA: new MeshLambertMaterial({ color: 0x000000 }),

  PRE_DEND: new MeshLambertMaterial({ color: 0x85CAFF, side: DoubleSide }),
  PRE_B_AXON: new MeshLambertMaterial({ color: 0x007FE0, side: DoubleSide }),
  PRE_NB_AXON: new MeshLambertMaterial({ color: 0x007FE0, side: DoubleSide }),

  POST_B_DEND: new MeshLambertMaterial({ color: 0xF21B18, side: DoubleSide }),
  POST_NB_DEND: new MeshLambertMaterial({ color: 0xF21B18, side: DoubleSide }),
  POST_AXON: new MeshLambertMaterial({ color: 0xF9A09F, side: DoubleSide }),

  SYNAPSE: new MeshLambertMaterial({ color: 0xF5F749 }),
}

export default class ConnectionViewer {
  private data: any = null;

  private container: HTMLDivElement = null;
  private canvas: HTMLCanvasElement = null;
  private renderer: WebGLRenderer = null;
  private scene: Scene = null;
  private camera: PerspectiveCamera = null;
  private controls: TrackballControls = null;
  private ctrl: RendererCtrl = new RendererCtrl();
  private onUserInteract: EventListener = null;

  private secMesh: { [neuriteType: string]: Mesh } = {};
  private somaMesh: Mesh = null;
  private synMesh: Mesh = null;

  private geometryWorkerPool: Pool = null;
  private morphologySecData: MorphologySecData = {};

  constructor(container: HTMLDivElement) {
    this.container = container;
  }

  // TODO: add type decrlaration for `data`
  public async init(data: any) {
    this.data = data;

    this.initCanvas();
    this.initRenderer();
    this.initScene();
    this.initCamera();
    this.initControls();
    this.initEvents();

    this.initGeometryWorkerPool();
    this.indexSecData();
    await this.createSynMesh();
    await this.createSomaMesh();
    await this.createSecMeshes();
    this.disposeGeometryWorkerPool();

    this.alignCamera();

    this.cleanup();

    this.startRenderLoop();
  }

  public resize() {
    const { clientWidth, clientHeight } = this.container;
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight);

    this.ctrl.renderOnce();
  }

  public setNeuriteVisibility(visibility) {
    Object.entries(visibility).forEach(([neuriteType, visible]) => {
      if(!this.secMesh[neuriteType]) {
        throw new Error(`Mesh for ${neuriteType} is not found}`);
      }

      const { material } = this.secMesh[neuriteType];
      material.visible = visible;
    });

    this.ctrl.renderOnce();
  }

  public destroy() {
    Object.values(this.secMesh).forEach(mesh => mesh.geometry.dispose());
    this.synMesh?.geometry.dispose();
    this.somaMesh?.geometry.dispose();

    this.renderer.domElement.removeEventListener('wheel', this.onUserInteract);
    this.renderer.domElement.removeEventListener('mousemove', this.onUserInteract);

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

  private initEvents() {
    this.onUserInteract = throttle(() => this.ctrl.renderFor(4000), 100).bind(this);

    this.canvas.addEventListener('wheel', this.onUserInteract, { capture: false, passive: true });
    this.canvas.addEventListener('mousemove', this.onUserInteract, { capture: false, passive: true });
  }

  private initGeometryWorkerPool() {
    const geometryWorkerFactory = () => new Worker(new URL('./workers/neuron-geometry.ts', import.meta.url), { name: 'geometry-worker'});
    this.geometryWorkerPool = new Pool(geometryWorkerFactory, 2);
  }

  private disposeGeometryWorkerPool() {
    this.geometryWorkerPool.terminate();
    this.geometryWorkerPool = null;
  }

  private async indexSecData() {
    console.time('secDataIndex');
    this.extractMorphologySecData(CellType.PRE, this.data.pre.morph);
    this.extractMorphologySecData(CellType.POST, this.data.post.morph);
    console.timeEnd('secDataIndex');
  }

  private extractMorphologySecData(cellType: number, sections) {
    const morphSecData = this.morphologySecData;
    sections.forEach((section) => {
      const secTypeStr = secTypeMap[section[0]];
      const isBaseSec = Boolean(section[1]);

      const ptsFlat = section.slice(-(section.length - 2));

      const secDataKey = `${cellType === CellType.PRE ? 'pre' : 'post'}_${isBaseSec ? 'b' : 'nb'}_${secTypeStr}`;

      if (!morphSecData[secDataKey]) {
        morphSecData[secDataKey] = [ptsFlat];
      } else {
        morphSecData[secDataKey].push(ptsFlat);
      }
    });
  }

  private createSomaMesh() {
    const somaGeometries = this.morphologySecData.pre_nb_soma.concat(this.morphologySecData.post_nb_soma)
      .map(pts => createSomaGeometryFromPoints(chunk(pts, 4)));

    const somaGeometry = mergeBufferGeometries(somaGeometries);

    this.somaMesh = new Mesh(somaGeometry, material.SOMA);
    this.scene.add(this.somaMesh);
  }

  private createSecMeshes() {
    const preDendGeometryPromise = this.geometryWorkerPool
      .queue(thread => thread.createNeuriteGeometry(this.morphologySecData.pre_nb_dend))
      .then(deserializeBufferGeometry);

    const preBaseAxonGeometryPromise = this.geometryWorkerPool
      .queue(thread => thread.createNeuriteGeometry(this.morphologySecData.pre_b_axon))
      .then(deserializeBufferGeometry);

    const preNonBaseAxonGeometryPromise = this.geometryWorkerPool
      .queue(thread => thread.createNeuriteGeometry(this.morphologySecData.pre_nb_axon))
      .then(deserializeBufferGeometry);

    const postBaseDendGeometryPromise = this.geometryWorkerPool
      .queue(thread => thread.createNeuriteGeometry(this.morphologySecData.post_b_dend))
      .then(deserializeBufferGeometry);

    const postNonBaseDendGeometryPromise = this.geometryWorkerPool
      .queue(thread => thread.createNeuriteGeometry(this.morphologySecData.post_nb_dend))
      .then(deserializeBufferGeometry);

    const postAxonGeometryPromise = this.geometryWorkerPool
      .queue(thread => thread.createNeuriteGeometry(this.morphologySecData.post_nb_axon))
      .then(deserializeBufferGeometry);

    console.time('genMesh');

    return Promise.all([
      preDendGeometryPromise,
      preBaseAxonGeometryPromise,
      preNonBaseAxonGeometryPromise,
      postBaseDendGeometryPromise,
      postNonBaseDendGeometryPromise,
      postAxonGeometryPromise
    ]).then(([
      preDendGeometry,
      preBaseAxonGeometry,
      preNonBaseAxonGeometry,
      postBaseDendGeometry,
      postNonBaseDendGeometry,
      postAxonGeometry
    ]) => {
      console.timeEnd('genMesh');

      const preDendMesh = new Mesh(preDendGeometry, material.PRE_DEND);
      this.secMesh[NeuriteType.PRE_NB_DEND] = preDendMesh;
      this.scene.add(preDendMesh);

      const preBaseAxonMesh = new Mesh(preBaseAxonGeometry, material.PRE_B_AXON);
      this.secMesh[NeuriteType.PRE_B_AXON] = preBaseAxonMesh;
      this.scene.add(preBaseAxonMesh);

      const preNonBaseAxonMesh = new Mesh(preNonBaseAxonGeometry, material.PRE_NB_AXON);
      this.secMesh[NeuriteType.PRE_NB_AXON] = preNonBaseAxonMesh;
      this.scene.add(preNonBaseAxonMesh);

      const postBaseDendMesh = new Mesh(postBaseDendGeometry, material.POST_B_DEND);
      this.secMesh[NeuriteType.POST_B_DEND] = postBaseDendMesh;
      this.scene.add(postBaseDendMesh);

      const postNonBaseDendMesh = new Mesh(postNonBaseDendGeometry, material.POST_NB_DEND);
      this.secMesh[NeuriteType.POST_NB_DEND] = postNonBaseDendMesh;
      this.scene.add(postNonBaseDendMesh);

      const postAxonMesh = new Mesh(postAxonGeometry, material.POST_AXON);
      this.secMesh[NeuriteType.POST_NB_AXON] = postAxonMesh;
      this.scene.add(postAxonMesh);
    });
  }

  private createSynMesh() {
    const geometries = this.data.synapses.map(synapse => {
      const geometry = new SphereGeometry(4, 32, 16);
      geometry.translate(...synapse.slice(0, 3));

      return geometry;
    });

    const geometry = mergeBufferGeometries(geometries);
    this.synMesh = new Mesh(geometry, material.SYNAPSE);
    this.scene.add(this.synMesh);
  }

  private cleanup() {
    this.data = null;
    this.morphologySecData = null;
  }

  private alignCamera() {
    console.log('Align camera');
    const preSomaPts = this.data.pre.morph.find(section => secTypeMap[section[0]] === 'soma').slice(2, 6);
    const postSomaPts = this.data.post.morph.find(section => secTypeMap[section[0]] === 'soma').slice(2, 6);

    const preSomaVec = new Vector3(preSomaPts[0], preSomaPts[1], preSomaPts[2]);
    const postSomaVec = new Vector3(postSomaPts[0], postSomaPts[1], postSomaPts[2]);

    const centerVec = new Vector3().addVectors(preSomaVec, postSomaVec).divideScalar(2);
    const radius = centerVec.distanceTo(preSomaVec);


    // const pts = this.data.pre.morph.find(section => secTypeMap[section[0]] === 'soma').slice(3, 7);
    // const center = new Vector3(pts[0], pts[1], pts[2]);
    // const radius = 50;

    this.camera.position.x = centerVec.x;
    this.camera.position.y = centerVec.y;

    const distance = radius / Math.tan(Math.PI * this.camera.fov / 360) * 2;

    this.camera.position.z = distance + centerVec.z;
    this.controls.target = centerVec;
    this.ctrl.renderOnce();
  }

  private startRenderLoop() {
    if (this.ctrl.stopped) return;

    if (this.ctrl.render) {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }

    requestAnimationFrame(this.startRenderLoop.bind(this));
  }
}
