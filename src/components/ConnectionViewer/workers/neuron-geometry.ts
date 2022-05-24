import last from 'lodash/last';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { Vector3 } from 'three/src/math/Vector3';
import { Matrix4 } from 'three/src/math/Matrix4';
import { CylinderGeometry } from 'three/src/geometries/CylinderGeometry';

import { expose, transfer } from '@/services/threads';


const HALF_PI = Math.PI * 0.5;

function _createSecGeometryFromPoints(pts, simplificationRatio = 2) {
  const sRatio = simplificationRatio;

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

  return mergeBufferGeometries(geometries);
}


function getGeometryBuffers(geometry) {
  const vertices = geometry.getAttribute('position').array.buffer;
  const normals = geometry.getAttribute('normal').array.buffer;

  const index = geometry.index.array.buffer;

  return [ vertices, normals, index ];
}

function createSecGeometriesFromPoints({ sections, simplificationRatio }) {
  const geometries = sections.map(pts => _createSecGeometryFromPoints(pts, simplificationRatio));
  const buffersList = geometries.map(geometry => getGeometryBuffers(geometry));

  const allBuffers = buffersList.flatMap();

  return transfer(buffersList, allBuffers);
}

function createSecGeometryFromPoints(pts, simplificationRatio) {
  const geometry = _createSecGeometryFromPoints(pts, simplificationRatio);
  const buffers = getGeometryBuffers(geometry);

  return transfer(buffers, buffers);
}


expose({
  createSecGeometryFromPoints,
  createSecGeometriesFromPoints,
});
