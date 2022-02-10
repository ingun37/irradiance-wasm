import * as THREE from "three";
import {
  ACESFilmicToneMapping,
  Color,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  TorusKnotGeometry,
  WebGLRenderer,
} from "three";
// import { DebugEnvironment } from "three/examples/jsm/environments/DebugEnvironment";
// import { HDRCubeTextureLoader } from "three/examples/jsm/loaders/HDRCubeTextureLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

export function pmrem(width: number, height: number, domID: string) {
  const camera = new PerspectiveCamera(40, width / height, 1, 1000);
  camera.position.set(0, 0, 120);
  const scene = new Scene();
  scene.background = new Color(0x000000);

  const renderer = new WebGLRenderer();
  document.getElementById(domID).appendChild(renderer.domElement);

  renderer.physicallyCorrectLights = true;
  renderer.toneMapping = ACESFilmicToneMapping;

  let geometry = new TorusKnotGeometry(18, 8, 150, 20);
  // let geometry = new THREE.SphereGeometry( 26, 64, 32 );
  let material = new MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.68,
    roughness: 0.08,
  });

  const torusMesh = new Mesh(geometry, material);
  scene.add(torusMesh);

  const geometry2 = new THREE.PlaneGeometry(200, 200);
  const material2 = new THREE.MeshBasicMaterial();

  const planeMesh = new THREE.Mesh(geometry2, material2);
  planeMesh.position.y = -50;
  planeMesh.rotation.x = -Math.PI * 0.5;
  scene.add(planeMesh);

  const pmremGenerator = new PMREMGenerator(renderer);
  pmremGenerator.compileCubemapShader();

  // const envScene = new DebugEnvironment();
  // const generatedCubeRenderTarget = pmremGenerator.fromScene(envScene);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  const render = () => {
    renderer.render(scene, camera);
  };
  new RGBELoader().load("venetian_crossroads_1k.hdr", (dataTexture) => {
    // hdrCubeMap.magFilter = THREE.LinearFilter;
    // hdrCubeMap.needsUpdate = true;

    const renderTarget = pmremGenerator.fromEquirectangular(dataTexture);
    // const cubeMap = hdrCubeMap;

    const newEnvMap = renderTarget ? renderTarget.texture : null;

    if (newEnvMap && newEnvMap !== torusMesh.material.envMap) {
      torusMesh.material.envMap = newEnvMap;
      torusMesh.material.needsUpdate = true;

      planeMesh.material.map = newEnvMap;
      planeMesh.material.needsUpdate = true;
    }

    torusMesh.rotation.y += 0.005;
    planeMesh.visible = true;

    // scene.background = cubeMap;
    renderer.toneMappingExposure = 1;
    render();
  });

  //renderer.toneMapping = ReinhardToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 50;
  controls.maxDistance = 300;
  controls.addEventListener("change", render);
}
