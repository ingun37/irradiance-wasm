import * as React from "react";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import PointsViewer from "./points-viewer";
import * as wasm from "../../../pkg";
import { roughness } from "../consts";
import { Button, Link, TextField, Typography } from "@mui/material";
import { useState } from "react";
import {
  generateDiffuseIrradianceMap,
  generatePreFilteredSpecularMap,
} from "../util";
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  // width: "300px",
  // height: "300px",
}));

const Everything = () => {
  const [diffuseSampleSize, setDiffuseSampleSize] = useState(1000);
  const [specularSampleSize, setSpecularSampleSize] = useState(1000);
  const [specularMapSize, setSpecularMapSize] = useState(128);
  const [specularMipLevels, setSpecularMipLevels] = useState(6);

  return (
    <Stack spacing={2} alignItems="center">
      <Typography variant="h3" component="div" gutterBottom>
        Diffuse Irradiance & Pre-Filtered Environment Map Generator
      </Typography>
      <Typography variant="subtitle1" gutterBottom component="div">
        This is a demo of Rust-WASM implementation of{" "}
        <Link href="https://learnopengl.com/PBR/IBL/Diffuse-irradiance">
          Diffuse Irradiance Map
        </Link>
        &nbsp;and&nbsp;
        <Link href="https://learnopengl.com/PBR/IBL/Specular-IBL">
          Pre-Filtered Environment Map
        </Link>
        &nbsp;generation algorithms.
      </Typography>
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
            <Button onClick={generateDiffuseIrradianceMap}>generate</Button>
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
              onClick={() =>
                generatePreFilteredSpecularMap(
                  specularSampleSize,
                  specularMapSize,
                  specularMipLevels
                )
              }
            >
              generate
            </Button>
          </Stack>
        </Item>
      </Stack>

      <Stack direction="row" spacing={2}>
        <Item>
          <Typography>Hammersley Sequence</Typography>

          <PointsViewer
            buffer={() => wasm.hammersleys(300)}
            itemSize={2}
            uniqueId="hammersly"
          />
        </Item>
        <Item>
          <Typography>GGXS</Typography>
          <PointsViewer
            buffer={() => wasm.ggxs(1, 1, 1, roughness, 60)}
            itemSize={3}
            uniqueId="ggxs"
          />
        </Item>
        <Item>
          <Typography>thestep</Typography>

          <PointsViewer
            buffer={() => wasm.the_step(1, 1, 1, roughness, 60)}
            itemSize={3}
            uniqueId="thestep"
          />
        </Item>
      </Stack>
    </Stack>
  );
};

export default Everything;
