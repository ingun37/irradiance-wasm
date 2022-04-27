import { ShaderMaterial, Texture } from "three";

export class NDCtoLinearDepthMaterial {
  material = new ShaderMaterial({
    uniforms: {
      ndcDepthMap: { value: null },
      far: { value: 0 },
      near: { value: 0 },
    },

    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	}`,

    fragmentShader: `
				varying vec2 vUv;
				uniform sampler2D ndcDepthMap;
				uniform float far;
				uniform float near;

                float calculateLinearZ(in float ndcDepth) {
                  float f = far;
                  float n = near;
                  float A = -(f + n) / (f - n);
                  float B = (-2.0 * f * n) / (f - n);
                  return B / (2.0 * ndcDepth - 1.0 - A);
                }

				void main() {
				    float ndcZ = texture2D(ndcDepthMap, vUv).x;
					//float s = 1.0;
					//if(ndcZ > 0.0) {
					//  s = 1.0;
					//}
					float lz = calculateLinearZ(ndcZ);
					//float l0 = calculateLinearZ(0.0);
					//gl_FragColor = vec4(vec3(mix(l0, lz, s)), 1.0);
					gl_FragColor = vec4(vec3(lz), 1.0);
				}`,
  });
  updateUniform(ndcDepthMap: Texture, far: number, near: number) {
    this.material.uniforms.ndcDepthMap.value = ndcDepthMap;
    this.material.uniforms.far.value = far;
    this.material.uniforms.near.value = near;
  }
}
