import * as React from "react";
import * as wasm from "irradiance-wasm";
import { useEffect } from "react";
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
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
    const geometry = new BufferGeometry();

    const arr = wasm.fibonacci_hemi_sphere(1000);

    geometry.setAttribute("position", new Float32BufferAttribute(arr, 3));
    const material = new PointsMaterial({ color: 0x00ff00, size: 0.05 });
    const points = new Points(geometry, material);
    scene.add(points);

    camera.position.z = 5;
    requestAnimationFrame(() => renderer.render(scene, camera));
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
