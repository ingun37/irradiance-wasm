import * as React from "react";
import { useEffect, useState } from "react";
import { interval, Subject, zip } from "rxjs";
import * as wasm from "../../../pkg";
import * as wasm_bg from "../../../pkg/irradiance_wasm_bg.wasm";
import { downloadBlob } from "../util";
import { Button } from "@mui/material";
const PreFilteredSpecular = () => {
  const [rx] = useState(new Subject<Uint8Array>());
  const onclick = () => {
    fetch("./venetian_crossroads_1k.hdr")
      .then((x) => x.arrayBuffer())
      .then((x) => new Uint8Array(x))
      .then((ab) => {
        wasm.specular(
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
          },
          0.1
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
  return <Button onClick={onclick}>Generate pre-filtered specular maps</Button>;
};

export default PreFilteredSpecular;
