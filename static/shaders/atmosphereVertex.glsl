varying vec3 vPositionW;
varying vec3 vNormalW;

void main() {
    vPositionW = vec3( vec4( position, 1.0 ) * modelMatrix);
    vNormalW = normalize( vec3( vec4( normal, 0.0 ) * modelMatrix ) );
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}