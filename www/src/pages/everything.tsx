import * as React from "react";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import PointsViewer from "./points-viewer";
import * as wasm from "../../../pkg";
import { roughness } from "../consts";
import { Button, Container, TextField, Typography } from "@mui/material";
import {
  downloadBlob,
  downloadBlurredHDR,
  generateDiffuseIrradianceMap,
  generatePreFilteredSpecularMap,
  webGpuTest,
} from "../util";
// import VisualDebug from "./visual-debug";
import Header from "./header";
import StatusTable from "./status-table";
import * as fflate from "fflate";
import PMREMDebug from "./pmrem-debug";
import OutlierDebug from "./outlier-debug";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  // width: "300px",
  // height: "300px",
}));

export default function Everything() {
  const [items, setItems] = useState<Map<string, Uint8Array>>(new Map());
  const [diffuseSampleSize, setDiffuseSampleSize] = useState(1000);
  const [specularSampleSize, setSpecularSampleSize] = useState(1000);
  const [specularMapSize, setSpecularMapSize] = useState(128);
  const [specularMipLevels, setSpecularMipLevels] = useState(6);
  const [blurSigma, setBlurSigma] = useState("3.14");
  return (
    <Stack spacing={2} alignItems="center">
      <Header />
      <TextField
        id="outlined-number"
        label="blur sigma"
        value={blurSigma}
        onChange={(e) => setBlurSigma(e.target.value)}
      />
      <Stack direction="row" spacing={2}>
        <Item>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h6">Diffuse Irradiance Map</Typography>

            <Item>
              <Typography>sampling pattern (Fibonacci sphere)</Typography>

              <PointsViewer
                buffer={() => wasm.fibonacci_hemi_sphere(300)}
                itemSize={3}
                uniqueId="fibo"
              />
            </Item>
            <TextField
              id="outlined-number"
              label="sample size"
              type="number"
              value={diffuseSampleSize}
              onChange={(e) =>
                setDiffuseSampleSize(Number.parseInt(e.target.value))
              }
            />
            <Button
              onClick={() => {
                generateDiffuseIrradianceMap(
                  diffuseSampleSize,
                  Number.parseFloat(blurSigma)
                ).then((buffers) => {
                  setItems(
                    buffers.reduce(
                      (m, buffer, idx) =>
                        m.set(`Environment_c0${idx}.png.hdr`, buffer),
                      new Map()
                    )
                  );
                });
              }}
            >
              generate
            </Button>
          </Stack>
        </Item>
        <Item>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h6">Pre-Filtered Environment Map</Typography>

            <Item>
              <Typography>sampling pattern</Typography>

              <PointsViewer
                buffer={() => wasm.the_step_2(1, 1, 1, roughness, 60)}
                itemSize={3}
                uniqueId="thestep2"
              />
            </Item>
            <Stack direction="row" spacing={2}>
              <TextField
                style={{ width: 90 }}
                label="sample size"
                type="number"
                value={specularSampleSize}
                onChange={(e) =>
                  setSpecularSampleSize(Number.parseInt(e.target.value))
                }
              />
              <TextField
                style={{ width: 90 }}
                label="map size"
                type="number"
                value={specularMapSize}
                onChange={(e) =>
                  setSpecularMapSize(Number.parseInt(e.target.value))
                }
              />
              <TextField
                style={{ width: 90 }}
                label="mip-levels"
                type="number"
                value={specularMipLevels}
                onChange={(e) =>
                  setSpecularMipLevels(Number.parseInt(e.target.value))
                }
              />
            </Stack>
            <Button
              onClick={() => {
                generatePreFilteredSpecularMap(
                  specularSampleSize,
                  specularMapSize,
                  specularMipLevels
                ).then((buffers) => {
                  setItems(
                    buffers.reduce(
                      (m, buffer, idx) =>
                        m.set(
                          `Environment_m0${Math.floor(idx / 6)}_c0${
                            idx % 6
                          }.png.hdr`,
                          buffer
                        ),
                      new Map()
                    )
                  );
                });
              }}
            >
              generate
            </Button>
          </Stack>
        </Item>
      </Stack>
      {/*<VisualDebug />*/}
      <Button
        onClick={() => {
          let z: any = {};
          items.forEach((buffer, name) => {
            z[name] = buffer;
          });
          const zipped = fflate.zipSync(z);
          downloadBlob(zipped, "environment-maps.zip");
        }}
      >
        Download All
      </Button>
      <StatusTable names={Array.from(items.keys())} />
      <Button onClick={webGpuTest}>WebGPU test</Button>
      <Container>
        <PMREMDebug />
      </Container>
      <Container>
        <OutlierDebug />
      </Container>
      <Button
        onClick={() => {
          downloadBlurredHDR(Number.parseFloat(blurSigma));
        }}
      >
        Download Blurred
      </Button>
    </Stack>
  );
}
