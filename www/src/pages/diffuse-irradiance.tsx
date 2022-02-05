import * as React from "react";
import * as wasm from "../../../pkg";
import * as wasm_bg from "../../../pkg/irradiance_wasm_bg.wasm";
import { useEffect, useState } from "react";
import { interval, Subject, zip } from "rxjs";
import { downloadBlob } from "../util";
import { Button } from "@mui/material";
const DiffuseIrradiance = () => {
  const [rx] = useState(new Subject<Uint8Array>());
  const onclick = () => {
    fetch("./venetian_crossroads_1k.hdr")
      .then((x) => x.arrayBuffer())
      .then((x) => new Uint8Array(x))
      .then((ab) => {
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
            rx.next(cp);
          }
        );
      });
  };
  useEffect(() => {
    zip(interval(2000), rx).subscribe({
      next([idx, buf]) {
        downloadBlob(buf, idx.toString() + ".hdr");
      },
    });
  }, []);
  return <Button onClick={onclick}>Generate Irradiance Diffuse maps</Button>;
};
export default DiffuseIrradiance;
