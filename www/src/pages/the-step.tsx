import * as React from "react";
import { useEffect } from "react";
import * as wasm from "irradiance-wasm";

import {
  BufferGeometry,
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
import { makeIndicator } from "../util";

const TheStep = () => {
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
    const arr = wasm.the_step(1, 1, 1, 1, 60);

    const weightedPoints = range(0, arr.length / 3 - 1).map(
      (i) => new Vector3(arr[i * 3], arr[i * 3 + 1], arr[i * 3 + 2])
    );
    geometry.setFromPoints(weightedPoints);
    // geometry.setAttribute("position", new Float32BufferAttribute(arr, 4));
    const material = new PointsMaterial({ color: 0xffff00, size: 0.04 });
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
export default TheStep;
