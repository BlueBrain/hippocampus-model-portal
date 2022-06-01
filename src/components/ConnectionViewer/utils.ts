
import { CylinderGeometry, Vector3, Matrix4, Quaternion, SphereBufferGeometry, Mesh, BufferGeometry, Float32BufferAttribute, Uint16BufferAttribute, Uint32BufferAttribute } from 'three';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import last from 'lodash/last';


export class RendererCtrl {
  public stopped = false;

  private countinuousRenderCounter = 0;
  private once = true;
  private stopTime = null;

  public get render() {
    if (this.stopped) return false;

    if (this.countinuousRenderCounter) return true;

    if (this.stopTime) {
      const now = Date.now();
      if (this.stopTime > now) return true;

      this.stopTime = null;
      return false;
    }

    const { once } = this;
    this.once = false;
    return once;
  }

  public renderOnce() {
    this.once = true;
  }

  public renderFor(time) {
    const now = Date.now();
    if (this.stopTime && this.stopTime > now + time) return;
    this.stopTime = now + time;
  }

  public renderUntilStopped() {
    this.countinuousRenderCounter += 1;
    return () => { this.countinuousRenderCounter -= 1; };
  }

  public stop() {
    this.stopped = true
  }
}

const HALF_PI = Math.PI * 0.5;
function _createSecGeometryFromPoints(pts, simplificationRatio = 1) {
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

export function deserializeBufferGeometry(data) {
  const [vertices, normals, index] = data;

  const normalsBuffer = new Float32BufferAttribute(normals, 3);
  const vertexBuffer = new Float32BufferAttribute(vertices, 3);
  const indexBuffer = vertexBuffer.count < 65535
    ? new Uint16BufferAttribute(index, 1)
    : new Uint32BufferAttribute(index, 1);

  const geometry = new BufferGeometry();

  geometry.setAttribute('position', vertexBuffer);
  geometry.setAttribute('normal', normalsBuffer);

  geometry.index = indexBuffer;

  return geometry;
}



function getSomaPositionFromPoints(pts) {
  let position;

  if (pts.length === 1) {
    position = new Vector3().fromArray(pts[0]);
  } else if (pts.length === 3) {
    position = new Vector3().fromArray(pts[0]);
  } else {
    position = pts
      .reduce((vec, pt) => vec.add(new Vector3().fromArray(pt)), new Vector3())
      .divideScalar(pts.length);
  }

  return position;
}

function getSomaRadiusFromPoints(pts) {
  // TODO: implement different soma types per spec.
  // See: https://morphio.readthedocs.io/en/latest/specification.html

  const position = getSomaPositionFromPoints(pts);
  let diameter;

  if (pts.length === 1) {
    diameter = pts[0][3];
  } else if (pts.length === 3) {
    const secondPt = new Vector3().fromArray(pts[1]);
    const thirdPt = new Vector3().fromArray(pts[2]);
    diameter = (position.distanceTo(secondPt) + position.distanceTo(thirdPt)) / 2;
  } else {
    // diameter = pts.reduce((distance, pt) => distance + position.distanceTo(new THREE.Vector3().fromArray(pt)), 0) / pts.length;
    diameter = Math.max(...pts.map(pt => position.distanceTo(new Vector3().fromArray(pt))));
  }

  const originalRadius = diameter / 2;

  return originalRadius * 1.9;
}

export function createSomaGeometryFromPoints(pts) {
  const position = getSomaPositionFromPoints(pts);
  const radius = getSomaRadiusFromPoints(pts);

  const geometry = new SphereBufferGeometry(radius, 14, 14);
  geometry.translate(...position.toArray());

  return geometry;
}

export function rotMatrix4x4FromArray3x3(array3x3) {
  const rotMatrix = new Matrix4();

  rotMatrix.set(
    ...array3x3.reduce((acc, row) => ([...acc, ...row, 0]), []),
    0, 0, 0, 1,
  );

  return rotMatrix;
}

export function quatFromArray3x3(array3x3) {
  const rotationMatrix = rotMatrix4x4FromArray3x3(array3x3);

  const quaternion = new Quaternion().setFromRotationMatrix(rotationMatrix);

  return quaternion;
}
