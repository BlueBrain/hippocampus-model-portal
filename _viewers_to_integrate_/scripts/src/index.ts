import { computeNormals } from "./utils/normals.js";
import {
  Vector3,
  addVectors,
  computeBoundingBox,
  scaleVector,
} from "./utils/calc.js";
import {
  forEachLineInTextFile,
  loadArrayBuffer,
  saveFloat32Array,
  saveJSON,
  saveUint32Array,
} from "./utils/fs.js";
import { parseNRRD } from "./utils/nrrd.js";

async function start() {
  console.log("Loading NRRD file...");
  const volumeData = await loadArrayBuffer("scripts/data/coordinates.nrrd");
  console.log(volumeData.byteLength);
  const volume = await parseNRRD(volumeData);
  console.log(volume.header);
  const aX = scaleVector(volume.header.spaceAxis.x, volume.header.sizes.x);
  const aY = scaleVector(volume.header.spaceAxis.y, volume.header.sizes.y);
  const aZ = scaleVector(volume.header.spaceAxis.z, volume.header.sizes.z);
  const bounds = computeBoundingBox([
    volume.header.spaceOrigin,
    addVectors(volume.header.spaceOrigin, aX),
    addVectors(volume.header.spaceOrigin, aY),
    addVectors(volume.header.spaceOrigin, aZ),
    addVectors(volume.header.spaceOrigin, aX, aY, aZ),
  ]);
  console.log(JSON.stringify(bounds, null, "    "));
  const points: Vector3[] = [];
  let normals: Vector3[] = [];
  const triangles: number[] = [];
  let [minX, minY, minZ] = [
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    Number.MAX_VALUE,
  ];
  let [maxX, maxY, maxZ] = [
    -Number.MAX_VALUE,
    -Number.MAX_VALUE,
    -Number.MAX_VALUE,
  ];
  await forEachLineInTextFile("scripts/data/coordinates/mesh.obj", (line) => {
    if (line.startsWith("v ")) {
      const [x, y, z] = parseVector3(line.substring(2));
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      minZ = Math.min(minZ, z);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      maxZ = Math.max(maxZ, z);
      points.push([x, y, z]);
    } else if (line.startsWith("vn ")) {
      normals.push(parseVector3(line.substring(3)));
    } else if (line.startsWith("f ")) {
      const elements = line
        .substring("f ".length)
        .split(" ")
        .map((item) => parseInt(item.split("/")[0], 10))
        // In Wavefront, indexes start at 1.
        .map((index) => index - 1);
      triangles.push(...elements);
    }
  });
  if (normals.length < points.length) {
    normals = computeNormals(points, triangles);
  }
  console.log("Number of vertices:", points.length);
  console.log("Number of normals: ", normals.length);
  console.log("Number of faces:   ", triangles.length / 3);
  console.log(minX, "< X <", maxX);
  console.log(minY, "< Y <", maxY);
  console.log(minZ, "< Z <", maxZ);
  console.log(`Saving "public/data/coordinates/mesh.json"...`);
  await saveJSON("frontend/public/data/coordinates/mesh.json", {
    min: [minX, minY, minZ],
    max: [maxX, maxY, maxZ],
  });
  const oX = (minX + maxX) / 2;
  const oY = (minY + maxY) / 2;
  const oZ = (minZ + maxZ) / 2;
  console.log(`Saving "public/data/coordinates/vert.dat"...`);
  await saveUint32Array(
    "frontend/public/data/coordinates/elem.dat",
    new Uint32Array(triangles)
  );
  console.log("Parsing the volume...");
  const data = new Float32Array(9 * points.length);
  let pointer = 0;
  let good = 0;
  for (let index = 0; index < points.length; index++) {
    const [x, y, z] = points[index];
    const [nx, ny, nz] = normals[index] ?? [1, 0, 0];
    const shift = scaleVector([nx, ny, nz], 0.2);
    let [xx, yy, zz] = addVectors([x, y, z], shift);
    let [u, v, w] = volume.getCoords([xx, yy, zz]);
    while (u < -0.9) {
      [xx, yy, zz] = addVectors([xx, yy, zz], shift);
      [u, v, w] = volume.getCoords([xx, yy, zz]);
    }
    data[pointer++] = x - oX;
    data[pointer++] = y - oY;
    data[pointer++] = z - oZ;
    data[pointer++] = nx;
    data[pointer++] = ny;
    data[pointer++] = nz;
    data[pointer++] = u;
    data[pointer++] = v;
    data[pointer++] = w;
    if (u > -1 || v > -1 || w > -1) good++;
  }
  console.log(`Saving "public/data/coordinates/vert.dat"...`);
  await saveFloat32Array("frontend/public/data/coordinates/vert.dat", data);
  console.log(
    "Coordinates found:",
    ((100 * good) / points.length).toFixed(2),
    "%"
  );
}

start();

function parseVector3(line: string): Vector3 {
  try {
    const [tx, ty, tz] = line.split(" ");
    const x = parseFloat(tx);
    if (isNaN(x)) throw Error();
    const y = parseFloat(ty);
    if (isNaN(y)) throw Error();
    const z = parseFloat(tz);
    if (isNaN(z)) throw Error();
    return [x, y, z];
  } catch (ex) {
    throw Error(`Unable to parse Vector3: "${line}"!`);
  }
}
coordinates/