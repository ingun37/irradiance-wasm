import {
  ShaderMaterial,
  Texture,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass";

export class NDCtoLinearDepthMaterial {
  material = new ShaderMaterial({
    uniforms: {
      ndcDepthMap: { value: null },
      far: { value: 0 },
      near: { value: 0 },
      amplify: { value: 2 },
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
                uniform float amplify;
                
                float calculateLinearZ(in float ndcDepth) {
                  float f = far;
                  float n = near;
                  float A = -(f + n) / (f - n);
                  float B = (-2.0 * f * n) / (f - n);
                  return B / (2.0 * ndcDepth - 1.0 - A);
                }

                float scaleNDC(in float ndcDepth, in float by) {
                  float d = ndcDepth;
                  float f = far;
                  float n = near;
                  float A = -(f + n) / (f - n);
                  float B = (-2.0 * f * n) / (f - n);
                  return B / (2.0*(by*(B/(2.0*d-1.0-A) + f) - f)) + (A+1.0)/2.0;
                }
				void main() {
				    float ndcZ = texture2D(ndcDepthMap, vUv).x;
				    float scale = 1.0;
				    if(0.0 < ndcZ)
				      scale = amplify;
					float lz = calculateLinearZ(scaleNDC(ndcZ, scale));
					gl_FragColor = vec4(vec3(lz), 1.0);
				}`,
  });
  renderWithUniform(
    ndcDepthMap: Texture,
    far: number,
    near: number,
    quad: FullScreenQuad,
    renderer: WebGLRenderer,
    dst: WebGLRenderTarget
  ) {
    this.material.uniforms.ndcDepthMap.value = ndcDepthMap;
    this.material.uniforms.far.value = far;
    this.material.uniforms.near.value = near;

    quad.material = this.material;
    renderer.setRenderTarget(dst);
    renderer.clear();
    quad.render(renderer);
  }
}
