precision mediump float;

uniform sampler2D texCoords;
uniform vec3 uniSelector;

varying vec3 varCoords; 
varying vec3 varNormal;

void main() {
    float u = dot(varCoords, uniSelector);
    vec3 dir = vec3(1.0, 0.0, 0.0);
    vec3 color = texture2D(texCoords, vec2(u, 0.5)).rgb;
    vec3 n = normalize(varNormal);
    float light = pow(-n.z, 2.0) * 2.0 + 0.1;
    gl_FragColor = vec4(light * color, 1.0);
}
