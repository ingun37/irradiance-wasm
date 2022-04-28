import {
  FloatType,
  MeshDepthMaterial,
  Object3D,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass";
import { GaussianBlurMaterial } from "./GaussianBlurMaterial";
import { NDCtoLinearDepthMaterial } from "./NDCtoLinearDepthMaterial";

const smallSize = 64;

export class GaussianPositionMap {
  // private unitPlane: Mesh;
  smallDepth = new WebGLRenderTarget(smallSize, smallSize, { type: FloatType });
  smallPixelsBuffer = new Float32Array(4 * smallSize * smallSize);
  depth = new WebGLRenderTarget(1, 1, {
    type: FloatType,
  });
  linearDepth = new WebGLRenderTarget(1, 1, {
    type: FloatType,
  });
  blurX = new WebGLRenderTarget(1, 1, { type: FloatType });
  blurXY = new WebGLRenderTarget(1, 1, { type: FloatType });

  position = new Vector3();
  material = new MeshDepthMaterial();
  pixelBuffer = new Float32Array(4);
  quad = new FullScreenQuad();
  ray = new Raycaster();

  minZ = 0;

  blurMaterial = new GaussianBlurMaterial();
  linearDepthMaterial = new NDCtoLinearDepthMaterial();
  constructor() {}

  gaussianWeightedPosition(
    renderer: WebGLRenderer,
    NDCx: number,
    NDCy: number,
    camera: PerspectiveCamera,
    obj: Object3D
  ) {
    const rayc = this.ray;
    rayc.setFromCamera({ x: NDCx, y: NDCy }, camera);

    const hits = rayc.intersectObject(obj);
    hits.sort((x, y) => (x.distance < y.distance ? 1 : -1));
    const hit = hits.shift();
    if (hit) return hit.point;

    renderer.readRenderTargetPixels(
      this.blurXY,
      Math.floor((this.blurXY.width * (NDCx + 1)) / 2),
      Math.floor((this.blurXY.height * (NDCy + 1)) / 2),
      1,
      1,
      this.pixelBuffer
    );

    const u = camera.getWorldDirection(new Vector3()).normalize();
    const v = new Vector3().copy(rayc.ray.direction).normalize();

    this.position.copy(
      v
        .multiplyScalar(Math.abs(this.pixelBuffer[0]) / u.dot(v))
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
    const context = {
      rt: renderer.getRenderTarget(),
      far: camera.far,
    };

    this.minZ = this.findMinZ(renderer, scene, camera);
    camera.far = -this.minZ;
    camera.updateProjectionMatrix();

    this.resizeRTtoFitCanvas(renderer, this.depth);
    this.drawData(renderer, camera, scene, this.depth);
    this.resizeRTtoFitCanvas(renderer, this.linearDepth);
    this.linearDepthMaterial.updateUniform(
      this.depth.texture,
      -this.minZ,
      camera.near
    );
    this.quad.material = this.linearDepthMaterial.material;
    renderer.setRenderTarget(this.linearDepth);
    renderer.clear();
    this.quad.render(renderer);
    this.blur(renderer, "x", this.linearDepth, this.blurX);
    this.blur(renderer, "y", this.blurX, this.blurXY);

    // clear up
    scene.overrideMaterial = null;
    renderer.setRenderTarget(context.rt);
    camera.far = context.far;
    camera.updateProjectionMatrix();
    // scene.remove(this.unitPlane);
  }

  findMinZ(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera) {
    this.drawData(renderer, camera, scene, this.smallDepth);
    renderer.readRenderTargetPixels(
      this.smallDepth,
      0,
      0,
      smallSize,
      smallSize,
      this.smallPixelsBuffer
    );

    const gaussian64x64 = (x: number, y: number) => {
      const m = 32;
      const s = 2;
      return (
        (1 / (s * (Math.PI * 2))) *
        Math.exp(
          -(
            ((x - m) * (x - m)) / (2 * s * s) +
            ((y - m) * (y - m)) / (2 * s * s)
          )
        )
      );
    };
    let weightSum = 0;
    let sum = 0;
    for (let i = 0; i < smallSize * smallSize; i++) {
      const d = this.smallPixelsBuffer[i * 4];
      if (d > 0) {
        const w = gaussian64x64(Math.floor(i / 64), i % 64);
        weightSum += w;
        const ld = calculateViewZ(camera, d);
        sum += w * ld;
      }
    }

    return sum / weightSum;
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
    this.resizeRTtoFitCanvas(renderer, dst);
    this.blurMaterial.updateUniform(src.texture, dir, dst.width, dst.height);
    this.quad.material = this.blurMaterial.material;
    renderer.setRenderTarget(dst);
    renderer.clear();
    this.quad.render(renderer);
  }

  // drawLinearDepth(
  //   renderer: WebGLRenderer,
  //   src: WebGLRenderTarget,
  //   dst: WebGLRenderTarget
  // ) {
  //   this.quad.material;
  // }
}

function calculateViewZ(
  camera: PerspectiveCamera | { far: number; near: number },
  packedDepth: number
) {
  const f = camera.far;
  const n = camera.near;
  const A = -(f + n) / (f - n);
  const B = (-2 * f * n) / (f - n);
  return B / (2 * packedDepth - 1 - A);
}

// const o = new Box3().setFromObject(obj).getCenter(new Vector3());
// const z = o.applyMatrix4(camera.matrixWorldInverse).z;
// const h = 2 * Math.abs(z) * Math.tan(camera.fov / 2);
// const w = h * camera.aspect;
// const s = new Matrix4().makeScale(w, h, 1);
// const t = new Matrix4().makeTranslation(0, 0, z);
// const final = new Matrix4().copy(camera.matrixWorld);
// this.unitPlane.applyMatrix4(final.multiply(t).multiply(s));
// scene.add(this.unitPlane);

// function makeUnitPlane() {
//   const g = new BufferGeometry().setFromPoints([
//     new Vector3(-0.5, -0.5, 0),
//     new Vector3(0.5, 0.5, 0),
//     new Vector3(-0.5, 0.5, 0),
//
//     new Vector3(-0.5, -0.5, 0),
//     new Vector3(0.5, -0.5, 0),
//     new Vector3(0.5, 0.5, 0),
//   ]);
//   return new Mesh(g, new MeshBasicMaterial({ color: 0x0000f0 }));
// }

// const p = makeUnitPlane();
// p.applyMatrix4(
//   new Matrix4()
//     .makeTranslation(0, 0, calculateViewZ(camera, min))
//     .premultiply(camera.matrixWorld)
// );
// scene.add(p);
// console.log(
//   "min",
//   calculateViewZ(camera, min),
//   "max",
//   calculateViewZ(camera, max)
// );
