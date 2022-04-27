import {
  FloatType,
  MeshDepthMaterial,
  Object3D,
  PerspectiveCamera,
  Raycaster,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass";

export class GaussianWeightedMarkerPositionMap {
  // private unitPlane: Mesh;
  smallDepth = new WebGLRenderTarget(64, 64, { type: FloatType });
  rt0 = new WebGLRenderTarget(1, 1, {
    type: FloatType,
  });
  rt1 = new WebGLRenderTarget(1, 1, { type: FloatType });
  final = new WebGLRenderTarget(1, 1, { type: FloatType });

  position = new Vector3();
  material = new MeshDepthMaterial();
  pixelBuffer = new Float32Array(4);
  blurMaterial = makeBlurMaterial();
  quad = new FullScreenQuad();
  ray = new Raycaster();

  constructor() {
    // const g = new BufferGeometry().setFromPoints([
    //   new Vector3(-0.5, -0.5, 0),
    //   new Vector3(0.5, 0.5, 0),
    //   new Vector3(-0.5, 0.5, 0),
    //
    //   new Vector3(-0.5, -0.5, 0),
    //   new Vector3(0.5, -0.5, 0),
    //   new Vector3(0.5, 0.5, 0),
    // ]);
    // this.unitPlane = new Mesh(g, new MeshPhongMaterial({}));
  }

  gaussianWeightedPosition(
    renderer: WebGLRenderer,
    NDCx: number,
    NDCy: number,
    camera: PerspectiveCamera
  ) {
    renderer.readRenderTargetPixels(
      this.final,
      Math.floor((this.final.width * (NDCx + 1)) / 2),
      Math.floor((this.final.height * (NDCy + 1)) / 2),
      1,
      1,
      this.pixelBuffer
    );

    const rayc = this.ray;
    rayc.setFromCamera({ x: NDCx, y: NDCy }, camera);
    const u = camera.getWorldDirection(new Vector3()).normalize();
    const v = new Vector3().copy(rayc.ray.direction).normalize();
    console.log("v?", v.toArray());
    console.log("u?", u.toArray());

    this.position.copy(
      v
        .multiplyScalar(
          Math.abs(calculateViewZ(camera, this.pixelBuffer[0])) / u.dot(v)
        )
        .add(camera.position)
    );

    return this.position;
  }

  updatePositionMap(
    camera: PerspectiveCamera,
    obj: Object3D,
    scene: Scene,
    renderer: WebGLRenderer
  ) {
    // const o = new Box3().setFromObject(obj).getCenter(new Vector3());
    // const z = o.applyMatrix4(camera.matrixWorldInverse).z;
    // const h = 2 * Math.abs(z) * Math.tan(camera.fov / 2);
    // const w = h * camera.aspect;
    // const s = new Matrix4().makeScale(w, h, 1);
    // const t = new Matrix4().makeTranslation(0, 0, z);
    // const final = new Matrix4().copy(camera.matrixWorld);
    // this.unitPlane.applyMatrix4(final.multiply(t).multiply(s));
    // scene.add(this.unitPlane);

    const previousRT = renderer.getRenderTarget();
    this.drawData(renderer, camera, scene, this.smallDepth);
    this.resizeRTtoFitCanvas(renderer, this.rt0);
    this.drawData(renderer, camera, scene, this.rt0);
    this.blur(renderer, "x", this.rt0, this.rt1);
    this.blur(renderer, "y", this.rt1, this.final);

    // clear up
    scene.overrideMaterial = null;
    renderer.setRenderTarget(previousRT);
    // scene.remove(this.unitPlane);
  }

  resizeRTtoFitCanvas(renderer: WebGLRenderer, dst: WebGLRenderTarget) {
    const rendererSize = renderer.getSize(new Vector2());
    if (!rendererSize.equals(new Vector2(dst.width, dst.height)))
      dst.setSize(rendererSize.x, rendererSize.y);
  }
  drawData(
    renderer: WebGLRenderer,
    camera: PerspectiveCamera,
    scene: Scene,
    dst: WebGLRenderTarget
  ) {
    renderer.setRenderTarget(dst);
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
      MAX_RADIUS: 30,
    },

    uniforms: {
      colorTexture: { value: null },
      texSize: { value: new Vector2(0.5, 0.5) },
      direction: { value: new Vector2(0.5, 0.5) },
      kernelRadius: { value: 30 },
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
function calculateViewZ(camera: PerspectiveCamera, packedDepth: number) {
  const f = camera.far;
  const n = camera.near;
  const A = -(f + n) / (f - n);
  const B = (-2 * f * n) / (f - n);
  return B / (2 * packedDepth - 1 - A);
}
