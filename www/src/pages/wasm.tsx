import * as React from "react";
import * as wasm from "irradiance-wasm";
import { useEffect } from "react";
import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import * as consts from "../consts";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const Wasm = () => {
  useEffect(() => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      consts.weight / consts.height,
      0.1,
      1000
    );
    const renderer = new WebGLRenderer();
    renderer.setSize(consts.weight, consts.height);
    document.getElementById(consts.threeDivId).appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", () => renderer.render(scene, camera));
    const geometry = new BoxGeometry();
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;
    requestAnimationFrame(() => renderer.render(scene, camera));
    const arr = wasm.fibonacci_hemi_sphere(10);
  });
  return (
    <div
      id={consts.threeDivId}
      style={{
        height: consts.height.toString() + "px",
        width: consts.weight.toString() + "px",
      }}
    />
  );
};
export default Wasm;
