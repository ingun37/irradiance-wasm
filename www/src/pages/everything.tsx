import * as React from "react";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import PointsViewer from "./points-viewer";
import * as wasm from "../../../pkg";
import { roughness } from "../consts";
import { Button, TextField, Typography } from "@mui/material";
import {
  downloadBlob,
  generateDiffuseIrradianceMap,
  generatePreFilteredSpecularMap,
  wasmtest,
} from "../util";
import VisualDebug from "./visual-debug";
import Header from "./header";
import StatusTable, { StatusData } from "./status-table";
import * as fflate from "fflate";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  // width: "300px",
  // height: "300px",
}));

export default function Everything() {
  const [statusItems, setStatusItems] = useState<StatusData[]>([]);
  const [diffuseSampleSize, setDiffuseSampleSize] = useState(1000);
  const [specularSampleSize, setSpecularSampleSize] = useState(1000);
  const [specularMapSize, setSpecularMapSize] = useState(128);
  const [specularMipLevels, setSpecularMipLevels] = useState(6);

  return (
    <Stack spacing={2} alignItems="center">
      <Header />
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
                generateDiffuseIrradianceMap().then((buffers) => {
                  const items = buffers.map((buffer, idx): StatusData => {
                    return {
                      name: `Environment_c0${idx}.png.hdr`,
                      buffer,
                    };
                  });
                  setStatusItems(items);
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
                  const items = buffers.map((buffer, idx): StatusData => {
                    return {
                      name: `Environment_m0${Math.floor(idx / 6)}_c0${
                        idx % 6
                      }.png.hdr`,
                      buffer,
                    };
                  });
                  setStatusItems(items);
                });
              }}
            >
              generate
            </Button>
          </Stack>
        </Item>
      </Stack>
      <VisualDebug />
      <Button
        onClick={() => {
          let z: any = {};
          for (const statusItem of statusItems) {
            z[statusItem.name] = statusItem.buffer;
          }
          const zipped = fflate.zipSync(z);
          downloadBlob(zipped, "environment-maps.zip");
        }}
      >
        Download All
      </Button>
      <StatusTable statusItems={statusItems} />
      <Button onClick={wasmtest}>Wasm test</Button>
    </Stack>
  );
}
