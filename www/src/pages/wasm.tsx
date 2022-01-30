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

const Wasm = () => {
  useEffect(() => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new WebGLRenderer();
    renderer.setSize(512, 512);
    document.getElementById("wasmDiv").appendChild(renderer.domElement);

    const geometry = new BoxGeometry();
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;
    requestAnimationFrame(() => renderer.render(scene, camera));
    const arr = wasm.fibonacci_hemi_sphere(10);
  });
  return <div id="wasmDiv" style={{ height: "512px", width: "512px" }} />;
};
export default Wasm;
