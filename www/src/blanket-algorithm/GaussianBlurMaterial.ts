import {
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass";

export class GaussianBlurMaterial {
  material = new ShaderMaterial({
    defines: {
      MAX_RADIUS: 50,
    },

    uniforms: {
      colorTexture: { value: null },
      texSize: { value: new Vector2(0.5, 0.5) },
      direction: { value: new Vector2(0.5, 0.5) },
      kernelRadius: { value: 50 },
    },

    vertexShader: `varying vec2 vUv;

				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,

    fragmentShader: `#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 texSize;
				uniform vec2 direction;
				uniform float kernelRadius;

				float gaussianPdf(in float x, in float sigma) {
					return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;
				}

				void main() {
					vec2 invSize = 1.0 / texSize;
					float weightSum = gaussianPdf(0.0, kernelRadius);
					vec4 diffuseSum = texture2D( colorTexture, vUv) * weightSum;
					vec2 delta = direction * invSize * kernelRadius/float(MAX_RADIUS);
					vec2 uvOffset = delta;
					for( int i = 1; i <= MAX_RADIUS; i ++ ) {
						float w = gaussianPdf(uvOffset.x, kernelRadius);
						vec4 sample1 = texture2D( colorTexture, vUv + uvOffset);
						vec4 sample2 = texture2D( colorTexture, vUv - uvOffset);
						diffuseSum += ((sample1 + sample2) * w);
						weightSum += (2.0 * w);
						uvOffset += delta;
					}
					gl_FragColor = diffuseSum/weightSum;
				}`,
  });

  renderWithUniform(
    direction: "x" | "y",
    quad: FullScreenQuad,
    renderer: WebGLRenderer,
    src: WebGLRenderTarget,
    dst: WebGLRenderTarget
  ) {
    this.material.uniforms["colorTexture"].value = src.texture;
    this.material.uniforms["direction"].value =
      direction === "x" ? new Vector2(1, 0) : new Vector2(0, 1);
    this.material.uniforms["texSize"].value.set(src.width, src.height);

    quad.material = this.material;
    renderer.setRenderTarget(dst);
    renderer.clear();
    quad.render(renderer);
  }
}
