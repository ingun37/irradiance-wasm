varying vec3 vOutputDirection;
uniform sampler2D env;

#define PI 3.14159265358
#define TAU 6.28318530718

const vec2 invAtan = vec2(0.1591, 0.3183);
vec2 SampleSphericalMap(vec3 v)
{
   vec2 uv = vec2(atan(v.z, v.x), asin(v.y));
   uv *= invAtan;
   uv += 0.5;
   return uv;
}

vec4 sample_equirect(vec3 _dir) {
    vec3 dir = normalize(_dir);
    float polar = mod(atan(dir.x,dir.z) + PI, TAU);
    float azimuth = mod(atan(length(dir.xz),dir.y),TAU);
    float u = polar / TAU;
    float v = azimuth / PI;
    return texture2D(env, vec2(u,v));
}
void main() {
    // vec3 sampled = sample_equirect(vOutputDirection).xyz;
    vec3 envColor = texture2D(env, SampleSphericalMap(normalize(vOutputDirection))).rgb;


       // envColor = envColor / (envColor + vec3(1.0));
       // envColor = pow(envColor, vec3(1.0/2.2));
    gl_FragColor = vec4(envColor,1);
    // gl_FragColor = vec4(0.5,0.1,0,1);
}