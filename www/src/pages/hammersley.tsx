import * as React from "react";
import { useEffect } from "react";
import * as wasm from "irradiance-wasm";

import {
  BufferGeometry,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import * as consts from "../consts";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { range } from "fp-ts/NonEmptyArray";
import { makeIndicator } from "../util";

const Hammersley = () => {
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
    const arr = wasm.hammersleys(300);

    const weightedPoints = range(0, arr.length / 2 - 1).map(
      (i) => new Vector2(arr[i * 2], arr[i * 2 + 1])
    );
    geometry.setFromPoints(weightedPoints);
    // geometry.setAttribute("position", new Float32BufferAttribute(arr, 4));
    const material = new PointsMaterial({ color: 0xffff00, size: 0.02 });
    const points = new Points(geometry, material);
    scene.add(points);
    scene.add(makeIndicator());
    camera.position.z = 5;
    requestAnimationFrame(() => renderer.render(scene, camera));
  }, []);

  return (
    <div>
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
export default Hammersley;
