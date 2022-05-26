import {
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereBufferGeometry,
  Vector2,
  WebGLRenderer,
} from "three";
// import { DebugEnvironment } from "three/examples/jsm/environments/DebugEnvironment";
// import { HDRCubeTextureLoader } from "three/examples/jsm/loaders/HDRCubeTextureLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { GGOutlinePass } from "./OutlinePass";

export function groupGeoOutline(width: number, height: number, domID: string) {
  const camera = new PerspectiveCamera(40, width / height, 1, 1000);
  camera.position.set(0, 0, 20);
  const scene = new Scene();
  scene.background = new Color(0xf00000);

  const renderer = new WebGLRenderer();
  document.getElementById(domID).appendChild(renderer.domElement);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  const outlinePass = new GGOutlinePass(
    new Vector2(width, height),
    scene,
    camera
  );
  {
    const { mesh, mA } = makeGroupedSphere();
    scene.add(mesh);
    mesh.translateX(-4);
    outlinePass.selectedObjects.set(mesh, [mA]);
    // outlinePass.selectedGroup.set(mesh, [mA]);
    mA.visible = false;
  }
  {
    const { mesh, mA } = makeGroupedSphere();
    scene.add(mesh);
    mesh.translateX(-2);
    outlinePass.selectedObjects.set(mesh, [mA]);
  }
  {
    const { mesh } = makeJustSphere();
    scene.add(mesh);
    outlinePass.selectedObjects.set(mesh, null);
  }
  {
    const { mesh, mB } = makeGroupedSphere();
    scene.add(mesh);
    mesh.translateX(2);
    outlinePass.selectedObjects.set(mesh, [mB]);
  }
  {
    const { mesh, mB, mA } = makeGroupedSphere();
    scene.add(mesh);
    mesh.translateX(4);
    outlinePass.selectedObjects.set(mesh, [mB]);
    mA.visible = false;
  }
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  composer.addPass(outlinePass);

  const render = () => {
    requestAnimationFrame(() => composer.render());
  };
  render();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 2;
  controls.maxDistance = 300;
  controls.addEventListener("change", render);
}
function makeGroupedSphere() {
  const g = new SphereBufferGeometry();
  const triNumber = g.index!.count / 3;
  const triHalf = Math.floor(triNumber / 2);
  g.addGroup(0, triHalf * 3, 0);
  g.addGroup(triHalf * 3, triNumber * 3, 1);
  const mA = new MeshBasicMaterial({ color: 0x770000 });
  const mB = new MeshBasicMaterial({ color: 0x008800 });
  const mesh = new Mesh(g, [mA, mB]);
  return { mesh, mA, mB };
}
function makeJustSphere() {
  const g = new SphereBufferGeometry();
  const mA = new MeshBasicMaterial({ color: 0x7700aa });
  const mesh = new Mesh(g, mA);
  return { mesh };
}
