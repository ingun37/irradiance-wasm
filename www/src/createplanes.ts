import {
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from "three";
// import { DebugEnvironment } from "three/examples/jsm/environments/DebugEnvironment";
// import { HDRCubeTextureLoader } from "three/examples/jsm/loaders/HDRCubeTextureLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { _createPlanes } from "./CustomPMREMGenerator";

export function createplanes(width: number, height: number, domID: string) {
  const camera = new PerspectiveCamera(40, width / height, 1, 1000);
  camera.position.set(0, 0, 70);
  const scene = new Scene();
  scene.background = new Color(0x000000);

  const renderer = new WebGLRenderer();
  document.getElementById(domID).appendChild(renderer.domElement);

  new TextureLoader().load("uv_grid_opengl.jpg", (map) => {
    const xx = _createPlanes(7);
    console.log(xx);
    const { lodPlanes } = xx;
    let cnt = 0;
    lodPlanes.forEach((lodPlane) => {
      const m = new Mesh(lodPlane, new MeshBasicMaterial({ map }));
      m.translateZ(cnt++);
      scene.add(m);
    });
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  const render = () => {
    renderer.render(scene, camera);
  };

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 10;
  controls.maxDistance = 300;
  controls.addEventListener("change", render);
}
