import {
  Box3,
  BufferGeometry,
  FloatType,
  Matrix4,
  MeshDepthMaterial,
  MeshPhongMaterial,
  Object3D,
  PerspectiveCamera,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { Mesh } from "three";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass";

export class GaussianWeightedMarkerPositionMap {
  private unitPlane: Mesh;
  rt = new WebGLRenderTarget(1, 1, {
    type: FloatType,
    format: RGBAFormat,
  });
  pingpong = new WebGLRenderTarget(1, 1, { type: FloatType });
  position = new Vector3();
  material: ShaderMaterial | MeshDepthMaterial;
  pixelBuffer = new Float32Array(4 * 16 * 16);
  blurMaterial = makeBlurMaterial();
  quad = new FullScreenQuad();
  constructor(isPositional: boolean) {
    const g = new BufferGeometry().setFromPoints([
      new Vector3(-0.5, -0.5, 0),
      new Vector3(0.5, 0.5, 0),
      new Vector3(-0.5, 0.5, 0),

      new Vector3(-0.5, -0.5, 0),
      new Vector3(0.5, -0.5, 0),
      new Vector3(0.5, 0.5, 0),
    ]);

    this.unitPlane = new Mesh(g, new MeshPhongMaterial({}));
    if (isPositional) {
      this.material = new ShaderMaterial({
        vertexShader: `
    varying vec3 pos;
    void main() {
      vec4 world = modelMatrix * vec4(position, 1.0);
      pos = world.xyz;
      gl_Position = projectionMatrix * viewMatrix * world;
    }
    `,
        fragmentShader: `
    varying vec3 pos;
    void main() {
      gl_FragColor = vec4(pos, 1.0);
    }
    `,
      });
    } else {
      this.material = new MeshDepthMaterial();
    }
  }

  gaussianWeightedPosition(
    renderer: WebGLRenderer,
    NDCx: number,
    NDCy: number
  ) {
    console.log(
      NDCx,
      NDCy,
      Math.floor((this.rt.width * (NDCx + 1)) / 2),
      Math.floor((this.rt.height * (NDCy + 1)) / 2)
    );
    renderer.readRenderTargetPixels(
      this.rt,
      Math.floor((this.rt.width * (NDCx + 1)) / 2),
      Math.floor((this.rt.height * (NDCy + 1)) / 2),
      16,
      16,
      this.pixelBuffer
    );
    this.position.set(
      this.pixelBuffer[0],
      this.pixelBuffer[1],
      this.pixelBuffer[2]
    );
    return this.position;
  }
  updatePositionMap(
    camera: PerspectiveCamera,
    obj: Object3D,
    scene: Scene,
    renderer: WebGLRenderer
  ) {
    const o = new Box3().setFromObject(obj).getCenter(new Vector3());
    const z = o.applyMatrix4(camera.matrixWorldInverse).z;
    const h = 2 * Math.abs(z) * Math.tan(camera.fov / 2);
    const w = h * camera.aspect;
    const s = new Matrix4().makeScale(w, h, 1);
    const t = new Matrix4().makeTranslation(0, 0, z);
    const final = new Matrix4().copy(camera.matrixWorld);
    this.unitPlane.applyMatrix4(final.multiply(t).multiply(s));
    scene.add(this.unitPlane);

    const previousRT = renderer.getRenderTarget();

    this.drawPositionToRT(renderer, camera, scene);
    this.blur(renderer, "x", this.rt, this.pingpong);
    this.blur(renderer, "y", this.pingpong, this.rt);

    // clear up
    scene.overrideMaterial = null;
    renderer.setRenderTarget(previousRT);
    scene.remove(this.unitPlane);
    return this.rt;
  }
  drawPositionToRT(
    renderer: WebGLRenderer,
    camera: PerspectiveCamera,
    scene: Scene
  ) {
    const rendererSize = renderer.getSize(new Vector2());
    if (!rendererSize.equals(new Vector2(this.rt.width, this.rt.height)))
      this.rt.setSize(rendererSize.x, rendererSize.y);
    renderer.setRenderTarget(this.rt);
    renderer.clear();
    scene.overrideMaterial = this.material;
    renderer.render(scene, camera);
  }
  blur(
    renderer: WebGLRenderer,
    dir: "x" | "y",
    src: WebGLRenderTarget,
    dst: WebGLRenderTarget
  ) {
    const rendererSize = renderer.getSize(new Vector2());
    if (!rendererSize.equals(new Vector2(dst.width, dst.height)))
      dst.setSize(rendererSize.x, rendererSize.y);

    const blurMaterial = this.blurMaterial;
    blurMaterial.uniforms["colorTexture"].value = src.texture;
    blurMaterial.uniforms["direction"].value =
      dir === "x" ? new Vector2(1, 0) : new Vector2(0, 1);
    blurMaterial.uniforms["texSize"].value.set(dst.width, dst.height);

    this.quad.material = blurMaterial;

    renderer.setRenderTarget(dst);
    renderer.clear();
    this.quad.render(renderer);
  }
}

function makeBlurMaterial() {
  return new ShaderMaterial({
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
}
