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
                  const A = -(f + n) / (f - n);
                  const B = (-2 * f * n) / (f - n);
                  return B / (2 * ndcDepth - 1 - A);
                }

				void main() {
					float linearZ = calculateLinearZ(texture2D(ndcDepthMap, vUv).x);
					gl_FragColor = vec4(vec3(linearZ,linearZ,linearZ), 1.0);
				}`,
  });
  updateUniform(ndcDepthMap: Texture, far: number, near: number) {
    this.material.uniforms.ndcDepthMap.value = ndcDepthMap;
    this.material.uniforms.far.value = far;
    this.material.uniforms.near.value = near;
  }
}
