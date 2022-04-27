import { ShaderMaterial, Texture, Vector2 } from "three";

export class GaussianBlurMaterial {
  material = new ShaderMaterial({
    defines: {
      MAX_RADIUS: 60,
    },

    uniforms: {
      colorTexture: { value: null },
      texSize: { value: new Vector2(0.5, 0.5) },
      direction: { value: new Vector2(0.5, 0.5) },
      kernelRadius: { value: 60 },
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
					  // * 2 를 해주는 이유는 엣지 근처에서는 모델 position 값과 근사하기위함 Ingun 2022.04.27
						float w = 4.0 * gaussianPdf(uvOffset.x, kernelRadius);
						vec4 sample1 = texture2D( colorTexture, vUv + uvOffset);
						vec4 sample2 = texture2D( colorTexture, vUv - uvOffset);
						diffuseSum += ((sample1 + sample2) * w);
						weightSum += (2.0 * w);
						uvOffset += delta;
					}
					gl_FragColor = diffuseSum/weightSum;
				}`,
  });

  updateUniform(
    texture: Texture,
    direction: "x" | "y",
    texWidth: number,
    texHeight: number
  ) {
    this.material.uniforms["colorTexture"].value = texture;
    this.material.uniforms["direction"].value =
      direction === "x" ? new Vector2(1, 0) : new Vector2(0, 1);
    this.material.uniforms["texSize"].value.set(texWidth, texHeight);
  }
}
