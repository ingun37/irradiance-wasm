import * as React from "react";
import { useEffect } from "react";
import * as wasm from "irradiance-wasm";
import {
  BufferGeometry,
  Float32BufferAttribute,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import * as consts from "../consts";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { range } from "fp-ts/NonEmptyArray";

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

    const arr = wasm.fibonacci_hemi_sphere(300);

    const weightedPoints = range(0, arr.length / 4 - 1).map((i) =>
      new Vector3(arr[i * 4], arr[i * 4 + 1], arr[i * 4 + 2]).multiplyScalar(
        arr[i * 4 + 3]
      )
    );
    geometry.setFromPoints(weightedPoints);
    // geometry.setAttribute("position", new Float32BufferAttribute(arr, 4));
    const material = new PointsMaterial({ color: 0x00ff00, size: 0.05 });
    const points = new Points(geometry, material);
    scene.add(points);

    camera.position.z = 5;
    requestAnimationFrame(() => renderer.render(scene, camera));
  });
  const aaa = new Uint8Array([1, 2, 3, 4]);
  const onclick = () => {
    fetch("./pedestrian_overpass_1k.hdr")
      .then((x) => x.arrayBuffer())
      .then((x) => new Uint8Array(x))
      .then((ab) => wasm.irradiance(ab));
  };
  return (
    <div>
      <button onClick={onclick}>click me</button>
      <div
        id={consts.threeDivId}
        style={{
          height: consts.height.toString() + "px",
          width: consts.weight.toString() + "px",
        }}
      />
    </div>
  );
};
export default Wasm;
