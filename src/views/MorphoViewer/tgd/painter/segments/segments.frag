#version 300 es

precision mediump float;

in vec4 varColor;
out vec4 FragColor;


void main() {
    if (varColor.a < 0.01) discard;
    else FragColor = varColor;
}
