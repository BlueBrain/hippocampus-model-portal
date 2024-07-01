precision mediump float;

// Attribute `position` is automatically added by ThreeJS.
// attribute vec4 position;
attribute vec3 coords;
varying vec3 varCoords;
varying vec3 varNormal;

void main() {
    varCoords = coords;
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    varNormal = mat3(modelViewMatrix) * normal;
    gl_Position = projectionMatrix * modelViewPosition;
}