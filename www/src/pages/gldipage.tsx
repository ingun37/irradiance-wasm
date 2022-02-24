import * as React from "react";
import { useEffect } from "react";
import {
  AmbientLight,
  BoxGeometry,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { makeIndicator } from "../util";
import { equirectToCubemap, loadRGBE } from "../di";
const uniqueId = "gldipage";
const consts = {
  height: 512,
  width: 512,
};
export default function Gldipage() {
  useEffect(() => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      consts.width / consts.height,
      0.1,
      1000
    );
    const renderer = new WebGLRenderer();
    renderer.setSize(consts.width, consts.height);
    document.getElementById(uniqueId).appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", () => renderer.render(scene, camera));
    loadRGBE()
      .then(equirectToCubemap(128, renderer))
      .then((cubeTexture) => {
        scene.background = cubeTexture;
        scene.add(new Mesh(new BoxGeometry(), new MeshPhongMaterial()));
        scene.add(new AmbientLight());
        scene.add(makeIndicator());
        camera.translateZ(10);

        requestAnimationFrame(() => renderer.render(scene, camera));
      });
  }, []);
  return (
    <div
      id={uniqueId}
      style={{
        height: consts.height.toString() + "px",
        width: consts.width.toString() + "px",
      }}
    />
  );
}
