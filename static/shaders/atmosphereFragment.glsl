varying vec3 vPositionW;
varying vec3 vNormalW;

void main() {
    vec3 color = vec3(0.3, .6, 1.);
    vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
    float fresnelTerm = dot(viewDirectionW, vNormalW);
    fresnelTerm = pow(0.5-fresnelTerm, 0.5);
    gl_FragColor = vec4( color, fresnelTerm);
}