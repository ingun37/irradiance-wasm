varying vec3 vOutputDirection;
uniform sampler2D env;

#define PI 3.14159265358
#define TAU 6.28318530718

vec4 sample_equirect(vec3 _dir) {
    vec3 dir = normalize(_dir);
    float polar = mod(atan(dir.x,dir.z) + PI, TAU);
    float azimuth = mod(atan(length(dir.xz),dir.y),TAU);
    float u = polar / TAU;
    float v = azimuth / PI;
    return texture2D(env, vec2(u,v));
}
void main() {
    vec3 sampled = sample_equirect(vOutputDirection).xyz;
    gl_FragColor = vec4(sampled,1);
}