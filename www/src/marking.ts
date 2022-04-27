import {
  AmbientLight,
  Box3,
  BufferGeometry,
  Color,
  DirectionalLight,
  FloatType,
  Matrix4,
  Mesh,
  MeshPhongMaterial,
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
import { GaussianWeightedMarkerPositionMap } from "./blanket-algorithm/GaussianWeightedMarkerPositioner";
import { Observable } from "rxjs";

export async function marking(
  width: number,
  height: number,
  domID: string,
  clickRx: Observable<[number, number]>
) {
  const camera = new PerspectiveCamera(40, width / height, 0.3, 4);
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
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 0.1;
  controls.maxDistance = 100;
  controls.addEventListener("change", render);

  scene.add(new DirectionalLight());
  scene.add(new AmbientLight());

  const c = new GaussianWeightedMarkerPositionMap();
  const teapot = new Mesh(new TeapotGeometry(0.2), new MeshPhongMaterial());
  teapot.translateX(0).translateY(0).translateZ(0);
  camera.lookAt(0, 0, 0);

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
  copyUniforms["tDiffuse"].value = c.final.texture;

  // @ts-ignore
  window.doo = function () {
    c.updatePositionMap(camera, teapot, scene, renderer);

    requestAnimationFrame(() => {
      renderer.clear();
      q.render(renderer);
    });
    clickRx.subscribe(([x, y]) => {
      const p = c.gaussianWeightedPosition(renderer, x, y, camera);
      console.log("position", p.x, p.y, p.z);
      scene.add(
        new Points(
          new BufferGeometry().setFromPoints([p]),
          new PointsMaterial({
            color: 0x00f000,
            size: 0.05,
            depthTest: false,
          })
        )
      );
    });

    // c.f(camera, teapot, scene, renderer);
    // scene.add(c.unitPlane);
    // render();
  };
  render();
}
