import {
  animationFrameScheduler,
  auditTime,
  fromEvent,
  merge,
  Observable,
  Subject,
} from "rxjs";
import {
  AmbientLight,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { GaussianPositionMap } from "./blanket-algorithm/GaussianPositionMap";
import { TeapotGeometry } from "three/examples/jsm/geometries/TeapotGeometry";
import { OrbitControls } from "./orbit/OrbitControls";

export async function damping(
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
  scene.add(teapot);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 0.1;
  controls.maxDistance = 10000;
  // controls.addEventListener("change", render);
  render();

  const extraRx = new Subject();
  const changeRx = fromEvent(controls, "change");

  controls.enableDamping = true;
  controls.dampingFactor = 0.3;
  controls.rotateSpeed = 0.7;
  merge(extraRx, changeRx)
    .pipe(auditTime(0, animationFrameScheduler))
    .subscribe(() => {
      if (
        0.0001 < Math.abs(controls.sphericalDelta.phi) ||
        0.0001 < Math.abs(controls.sphericalDelta.theta)
      ) {
        extraRx.next(0);
        controls.update();
      }
      render();
    });

  window.controls = controls;
}
