import * as React from "react";
import { useEffect, useState } from "react";
import * as wasm from "irradiance-wasm";
import * as wasm_bg from "irradiance-wasm/irradiance_wasm_bg.wasm";

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
import { downloadBlob } from "../util";
import { interval, Subject, zip } from "rxjs";

const Wasm = () => {
  const [rx] = useState(new Subject<Uint8Array>());
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
    zip(interval(2000), rx).subscribe({
      next([idx, buf]) {
        downloadBlob(buf, idx.toString() + ".hdr");
      },
    });
  }, []);
  const onclick = () => {
    fetch("./venetian_crossroads_1k.hdr")
      .then((x) => x.arrayBuffer())
      .then((x) => new Uint8Array(x))
      .then((ab) => {
        wasm.irradiance(
          10000,
          64,
          ab,
          (idx: bigint, offset: number, size: bigint) => {
            console.log(
              idx,
              offset,
              size,
              typeof idx,
              typeof offset,
              typeof size
            );
            const hdrBuf = new Uint8Array(
              wasm_bg.memory.buffer,
              offset,
              Number(size)
            );
            const cp = new Uint8Array(new ArrayBuffer(Number(size)));
            cp.set(hdrBuf);
            rx.next(cp);

            // console.log("aaa", x, y);
          }
        );
      });
    // .then((buf) => downloadBlob(buf, "a.hdr"));
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
