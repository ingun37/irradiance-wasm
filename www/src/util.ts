import { ArrowHelper, Object3D, Vector3 } from "three";

import { zip } from "fp-ts/Array";
import * as wasm from "../../pkg";
import * as wasm_bg from "../../pkg/irradiance_wasm_bg.wasm";

export function downloadURL(data, fileName) {
  const a = document.createElement("a");
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  a.style.display = "none";
  a.click();
  a.remove();
}

export function downloadBlob(
  data: Uint8Array,
  fileName: string,
  mimeType: string = "application/octet-stream"
) {
  const blob = new Blob([data], {
    type: mimeType,
  });

  const url = window.URL.createObjectURL(blob);

  downloadURL(url, fileName);

  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}

export function makeIndicator() {
  const xyz = [
    new Vector3(1, 0, 0),
    new Vector3(0, 1, 0),
    new Vector3(0, 0, 1),
  ];
  const colors = [0xff0000, 0x00ff00, 0x0000ff];
  const origin = new Vector3(0, 0, 0);
  const length = 1;

  const arrows = zip(xyz, colors).map(
    ([dir, hex]) => new ArrowHelper(dir, origin, length, hex)
  );
  const group = new Object3D();
  group.add(...arrows);

  return group;
}

export function fetchSampleHDR() {
  return fetch("./venetian_crossroads_1k.hdr")
    .then((x) => x.arrayBuffer())
    .then((x) => new Uint8Array(x));
}

export function generateDiffuseIrradianceMap() {
  return fetchSampleHDR().then((ab) => {
    let buffers: Uint8Array[] = [];
    wasm.irradiance(
      1000,
      64,
      ab,
      (idx: bigint, offset: number, size: bigint) => {
        const hdrBuf = new Uint8Array(
          wasm_bg.memory.buffer,
          offset,
          Number(size)
        );
        const cp = new Uint8Array(new ArrayBuffer(Number(size)));
        cp.set(hdrBuf);
        buffers.push(cp);
      }
    );
    return buffers;
  });
}

export async function generatePreFilteredSpecularMap(
  sampleCount: number,
  mapSize: number,
  mipLevels: number
) {
  return fetchSampleHDR().then((ab) => {
    let buffers: Uint8Array[] = [];

    wasm.specular(
      sampleCount,
      mapSize,
      ab,
      (idx: bigint, offset: number, size: bigint) => {
        const hdrBuf = new Uint8Array(
          wasm_bg.memory.buffer,
          offset,
          Number(size)
        );
        const cp = new Uint8Array(new ArrayBuffer(Number(size)));
        cp.set(hdrBuf);
        buffers.push(cp);
      },
      mipLevels
    );
    return buffers;
  });
}

export function wasmtest() {
  fetch("/shader.wgsl")
    .then((x) => x.text())
    .then((shaderCode) => wasm.wasmtest(shaderCode));
}

export function tup<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}
