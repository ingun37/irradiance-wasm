import {
  AmbientLight,
  Color,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export async function codetest(width: number, height: number, domID: string) {
  const camera = new PerspectiveCamera(40, width / height, 1, 10000);
  camera.position.set(0, 0, 1000);
  const scene = new Scene();
  scene.background = new Color(0xf00000);

  const renderer = new WebGLRenderer();
  document.getElementById(domID).appendChild(renderer.domElement);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  const render = () => {
    requestAnimationFrame(() => renderer.render(scene, camera));
  };
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1;
  controls.maxDistance = 10000;
  controls.addEventListener("change", render);

  const magrathea = planet(
    new DRACOLoader().setDecoderPath(
      "https://www.gstatic.com/draco/v1/decoders/"
    )
  );
  scene.add(new DirectionalLight());
  scene.add(new AmbientLight());

  scene.add(
    await magrathea({
      geometry: "/sun/geometry.drc",
      // normal: "/earth/normal.png",
      diffuse: "/sun/diffuse.png",
    })
  );

  render();
}
function planet(dracoLoader: DRACOLoader) {
  return async function ({
    geometry,
    diffuse,
    normal,
  }: {
    geometry: string;
    diffuse: string;
    normal?: string;
  }) {
    return new Mesh(
      await dracoLoader.loadAsync(geometry),
      new MeshStandardMaterial({
        map: await new TextureLoader().loadAsync(diffuse),
        side: DoubleSide,
        normalMap: normal
          ? await new TextureLoader().loadAsync(normal)
          : undefined,
      })
    );
  };
}
