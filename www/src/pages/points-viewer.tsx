import * as React from "react";
import { useEffect } from "react";

import {
  BufferGeometry,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import * as consts from "../consts";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { range } from "fp-ts/NonEmptyArray";
import { makeIndicator } from "../util";

const PointsViewer = (props: {
  buffer: () => Float32Array;
  itemSize: number;
  uniqueId: string;
}) => {
  const uniqueId = "pointsviewer" + props.uniqueId;
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
    document.getElementById(uniqueId).appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", () => renderer.render(scene, camera));
    const geometry = new BufferGeometry();
    const arr = props.buffer();
    const itemSize = props.itemSize;
    const pointsMaker = () => {
      if (itemSize === 2)
        return range(0, arr.length / itemSize - 1).map(
          (i) => new Vector2(arr[i * itemSize], arr[i * itemSize + 1])
        );
      else if (itemSize === 3)
        return range(0, arr.length / itemSize - 1).map(
          (i) =>
            new Vector3(
              arr[i * itemSize],
              arr[i * itemSize + 1],
              arr[i * itemSize + 2]
            )
        );
      else throw new Error("unsupported item size: " + itemSize.toString());
    };
    geometry.setFromPoints(pointsMaker());
    // geometry.setAttribute("position", new Float32BufferAttribute(arr, 4));
    const material = new PointsMaterial({ color: 0xffff00, size: 0.04 });
    const points = new Points(geometry, material);
    scene.add(points);
    scene.add(makeIndicator());
    camera.position.z = 5;
    requestAnimationFrame(() => renderer.render(scene, camera));
  }, []);

  return (
    <div
      id={uniqueId}
      style={{
        height: consts.height.toString() + "px",
        width: consts.weight.toString() + "px",
      }}
    />
  );
};
export default PointsViewer;
