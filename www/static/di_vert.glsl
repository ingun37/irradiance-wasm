varying vec3 vOutputDirection;

void main() {
    vec4 world = modelMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * viewMatrix * world;
    vOutputDirection = position;
}