
import {
  BufferGeometry,
  Float32BufferAttribute,
  Matrix4,
  Quaternion,
  SphereBufferGeometry,
  Uint16BufferAttribute,
  Uint32BufferAttribute,
  Vector3,
} from 'three';


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
    diameter = Math.max(...pts.map(pt => position.distanceTo(new Vector3().fromArray(pt))));
  }

  const originalRadius = diameter / 2;

  return originalRadius * 1.9;
}


// TODO: clean up
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
