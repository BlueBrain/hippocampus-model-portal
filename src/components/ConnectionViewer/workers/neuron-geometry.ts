import chunk from 'lodash/chunk';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { Vector3 } from 'three/src/math/Vector3';
import { Matrix4 } from 'three/src/math/Matrix4';
import { CylinderGeometry, BufferGeometry } from 'three/src/geometries/CylinderGeometry';
import { expose, transfer } from '@/services/threads';

const HALF_PI = Math.PI * 0.5;

const SIMPLIFICATION_DISTANCE_THRESHOLD = 6;
const SIMPLIFICATION_DIAMETER_STD_THRESHOLD = 0.1;

function getStandardDeviation(array: number[]): number {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}

function simplify(pts: number[][]): void {
  let i = 0;
  while (i < pts.length - 2) {
    const vStart = new Vector3(...pts[i]);
    const vEnd = new Vector3(...pts[i + 2]);
    const distance = vStart.distanceTo(vEnd);

    const sd = getStandardDeviation([pts[i][3], pts[i + 1][3], pts[i + 2][3]]);

    if (distance < SIMPLIFICATION_DISTANCE_THRESHOLD && sd < SIMPLIFICATION_DIAMETER_STD_THRESHOLD) {
      pts.splice(i + 1, 1);
    } else {
      i++;
    }
  }
}

function _createSecGeometryFromPoints(pts: number[][]): BufferGeometry {
  simplify(pts);

  const geometries: BufferGeometry[] = [];

  for (let i = 0; i < pts.length - 1; i += 1) {
    const vstart = new Vector3(pts[i][0], pts[i][1], pts[i][2]);
    const vend = new Vector3(pts[i + 1][0], pts[i + 1][1], pts[i + 1][2]);
    const distance = vstart.distanceTo(vend);
    const position = vend.clone().add(vstart).divideScalar(2);

    const dStart = pts[i][3] / 2;
    const dEnd = pts[i + 1][3] / 2;

    const geometry = new CylinderGeometry(dStart, dEnd, distance, 12, 1, true);

    const orientation = new Matrix4();
    const offsetRotation = new Matrix4();
    orientation.lookAt(vstart, vend, new Vector3(0, 1, 0));
    offsetRotation.makeRotationX(HALF_PI);
    orientation.multiply(offsetRotation);
    geometry.applyMatrix4(orientation);
    geometry.translate(position.x, position.y, position.z);

    geometries.push(geometry);
  }

  const secGeometry = mergeBufferGeometries(geometries);
  geometries.forEach(geometry => geometry.dispose());

  return secGeometry;
}

function _getGeometryBuffers(geometry: BufferGeometry): ArrayBuffer[] {
  const vertices = geometry.getAttribute('position').array.buffer;
  const normals = geometry.getAttribute('normal').array.buffer;
  const index = geometry.index ? geometry.index.array.buffer : new ArrayBuffer(0);

  return [vertices, normals, index];
}

interface TransferResult {
  payload: ArrayBuffer[];
  transferable: boolean;
  transferables: any;
}

function createNeuriteGeometry(ptsList: number[][][]): ArrayBuffer[] {
  const geometries = ptsList.map(pts => _createSecGeometryFromPoints(chunk(pts, 4) as number[][]));

  const geometry = mergeBufferGeometries(geometries);
  const buffers = _getGeometryBuffers(geometry);

  geometries.forEach(geometry => geometry.dispose());

  // Ensure buffers is an array of ArrayBuffer before calling transfer
  if (buffers.every(buffer => buffer instanceof ArrayBuffer)) {
    const transferResult = transfer(buffers, buffers) as unknown as TransferResult;
    return transferResult.payload;
  } else {
    throw new Error('Buffers should be an array of ArrayBuffer');
  }
}

function createSecGeometry(pts: number[][]): ArrayBuffer[] {
  const geometry = _createSecGeometryFromPoints(pts);
  const buffers = _getGeometryBuffers(geometry);

  // Ensure buffers is an array of ArrayBuffer before calling transfer
  if (buffers.every(buffer => buffer instanceof ArrayBuffer)) {
    const transferResult = transfer(buffers, buffers) as unknown as TransferResult;
    return transferResult.payload;
  } else {
    throw new Error('Buffers should be an array of ArrayBuffer');
  }
}

expose({
  createNeuriteGeometry,
  createSecGeometry,
});