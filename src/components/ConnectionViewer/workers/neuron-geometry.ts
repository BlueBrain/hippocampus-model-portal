import last from 'lodash/last';
import chunk from 'lodash/chunk';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { Vector3 } from 'three/src/math/Vector3';
import { Matrix4 } from 'three/src/math/Matrix4';
import { CylinderGeometry } from 'three/src/geometries/CylinderGeometry';

import { expose, transfer } from '@/services/threads';


const HALF_PI = Math.PI * 0.5;

const SIMPLIFICATION_DISTANCE_THRESHOLD = 6;
const SIMPLIFICATION_DIAMETER_STD_THRESHOLD = 0.1;

function getStandardDeviation(array) {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}

function simplify(pts) {
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

function _createSecGeometryFromPoints(pts, simplificationRatio = 1) {
  const sRatio = simplificationRatio;

  simplify(pts);

  const geometries = [];

  for (let i = 0; i < pts.length - 1; i += sRatio) {
    const vstart = new Vector3(pts[i][0], pts[i][1], pts[i][2]);
    const vend = new Vector3(
      pts[i + sRatio] ? pts[i + sRatio][0] : last(pts)[0],
      pts[i + sRatio] ? pts[i + sRatio][1] : last(pts)[1],
      pts[i + sRatio] ? pts[i + sRatio][2] : last(pts)[2],
    );
    const distance = vstart.distanceTo(vend);
    const position = vend.clone().add(vstart).divideScalar(2);

    const dStart = pts[i][3] * 2;
    const dEnd = (pts[i + sRatio] ? pts[i + sRatio][3] : last(pts)[3]) * 2;

    const geometry = new CylinderGeometry(
      dStart,
      dEnd,
      distance,
      Math.max(5, Math.ceil(24 / sRatio)),
      1,
      true,
    );

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


function _getGeometryBuffers(geometry) {
  const vertices = geometry.getAttribute('position').array.buffer;
  const normals = geometry.getAttribute('normal').array.buffer;

  const index = geometry.index.array.buffer;

  return [ vertices, normals, index ];
}


function createNeuriteGeometry(ptsList, simplificationRatio) {
  const geometries = ptsList.map(pts => _createSecGeometryFromPoints(chunk(pts, 4), simplificationRatio));

  const geometry = mergeBufferGeometries(geometries);
  const buffers = _getGeometryBuffers(geometry);

  geometries.forEach(geometry => geometry.dispose());

  return transfer(buffers, buffers);
}

function createSecGeometry(pts, simplificationRatio) {
  const geometry = _createSecGeometryFromPoints(pts, simplificationRatio);
  const buffers = _getGeometryBuffers(geometry);

  return transfer(buffers, buffers);
}


expose({
  createNeuriteGeometry,
  createSecGeometry,
});
