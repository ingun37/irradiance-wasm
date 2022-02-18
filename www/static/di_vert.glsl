varying vec3 vOutputDirection;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    vOutputDirection = gl_Position.xyz;
}