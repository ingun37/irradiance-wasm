import { ArrowHelper, Group, Object3D, Vector3 } from "three";
import { zip } from "fp-ts/Array";

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
