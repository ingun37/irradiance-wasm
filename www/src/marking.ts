import {
  AmbientLight,
  Box3,
  BufferGeometry,
  Color,
  DirectionalLight,
  FloatType,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  NoBlending,
  Object3D,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Raycaster,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  UniformsUtils,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TeapotGeometry } from "three/examples/jsm/geometries/TeapotGeometry";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { GaussianPositionMap } from "./blanket-algorithm/GaussianPositionMap";
import { Observable } from "rxjs";

export async function marking(
  width: number,
  height: number,
  domID: string,
  clickRx: Observable<[number, number]>
) {
  const camera = new PerspectiveCamera(40, width / height, 0.3, 100);
  camera.position.set(0, 0, 1);
  // camera.lookAt(0, 0, -10);
  const scene = new Scene();
  // scene.background = new Color(0xf00000);

  const renderer = new WebGLRenderer();
  document.getElementById(domID).appendChild(renderer.domElement);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  const render = () => {
    requestAnimationFrame(() => renderer.render(scene, camera));
  };

  scene.add(new DirectionalLight(undefined, 0.5));
  scene.add(new AmbientLight(undefined, 0.5));

  const c = new GaussianPositionMap();
  const teapot = new Mesh(
    new TeapotGeometry(0.2),
    new MeshStandardMaterial({ color: 0x5040f0 })
  );

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 0.1;
  controls.maxDistance = 10000;
  controls.addEventListener("change", render);

  // @ts-ignore
  window.relocateTeapot = function () {
    const newLoc = new Vector3()
      .copy(camera.position)
      .add(camera.getWorldDirection(new Vector3()));
    teapot.translateX(newLoc.x).translateY(newLoc.y).translateZ(newLoc.z);
  };
  scene.add(teapot);
  const copyUniforms = UniformsUtils.clone(CopyShader.uniforms);
  copyUniforms["opacity"].value = 1.0;

  const materialCopy = new ShaderMaterial({
    uniforms: copyUniforms,
    vertexShader: CopyShader.vertexShader,
    fragmentShader: CopyShader.fragmentShader,
    blending: NoBlending,
    depthTest: false,
    depthWrite: false,
    transparent: true,
  });

  const q = new FullScreenQuad(materialCopy);
  copyUniforms["tDiffuse"].value = c.blurXY.texture;

  // @ts-ignore
  window.doo = function () {
    c.updatePositionMap(camera, teapot, scene, renderer);
    //
    // requestAnimationFrame(() => {
    //   renderer.clear();
    //   q.render(renderer);
    // });

    const stepX = 0.06;
    const stepY = 0.06;
    for (let x = 0; x < 1; x += stepX) {
      for (let y = 0; y < 1; y += stepY) {
        for (let signX = -1; signX <= 1; signX += 2) {
          for (let signY = -1; signY <= 1; signY += 2) {
            const p = c.gaussianWeightedPosition(
              renderer,
              x * signX,
              y * signY,
              camera,
              teapot
            );
            scene.add(
              new Points(
                new BufferGeometry().setFromPoints([p]),
                new PointsMaterial({
                  color: 0x00f000,
                  size: 0.02,
                  depthTest: false,
                })
              )
            );
          }
        }
      }
    }
    // clickRx.subscribe(([x, y]) => {
    //   const p = c.gaussianWeightedPosition(renderer, x, y, camera, teapot);
    //   console.log("position", p.x, p.y, p.z);
    //   scene.add(
    //     new Points(
    //       new BufferGeometry().setFromPoints([p]),
    //       new PointsMaterial({
    //         color: 0x00f000,
    //         size: 0.02,
    //         depthTest: false,
    //       })
    //     )
    //   );
    // });

    // c.f(camera, teapot, scene, renderer);
    // scene.add(c.unitPlane);
    render();
  };
  render();
}
