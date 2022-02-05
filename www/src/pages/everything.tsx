import * as React from "react";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import PointsViewer from "./points-viewer";
import * as wasm from "../../../pkg";
import { roughness } from "../consts";
import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import {
  generateDiffuseIrradianceMap,
  generatePreFilteredSpecularMap,
} from "../util";
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: "center",
  color: theme.palette.text.secondary,
  // width: "300px",
  // height: "300px",
}));

const Everything = () => {
  const [diffuseSampleSize, setDiffuseSampleSize] = useState(1000);
  const [specularSampleSize, setSpecularSampleSize] = useState(1000);

  return (
    <div>
      <Stack spacing={2} alignItems="center">
        <Stack direction="row" spacing={2}>
          <Item>
            <TextField
              id="outlined-number"
              label="diffuse irradiance sampling size"
              type="number"
              value={diffuseSampleSize}
              onChange={(e) =>
                setDiffuseSampleSize(Number.parseInt(e.target.value))
              }
            />
            <Button onClick={generateDiffuseIrradianceMap}>
              generate diffuse irradiance map
            </Button>
          </Item>
          <Item>
            <TextField
              id="outlined-number"
              label="pre-filtered specular sampling size"
              type="number"
              value={specularSampleSize}
              onChange={(e) =>
                setSpecularSampleSize(Number.parseInt(e.target.value))
              }
            />
            <Button onClick={generatePreFilteredSpecularMap}>
              generate pre-filtered specular map
            </Button>
          </Item>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Item>
            <Typography>Fibonacci Sphere</Typography>

            <PointsViewer
              buffer={() => wasm.fibonacci_hemi_sphere(300)}
              itemSize={3}
              uniqueId="fibo"
            />
          </Item>
          <Item>
            <Typography>Hammersley Sequence</Typography>

            <PointsViewer
              buffer={() => wasm.hammersleys(300)}
              itemSize={2}
              uniqueId="hammersly"
            />
          </Item>
        </Stack>
        <Stack direction="row" spacing={2}>
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
          <Item>
            <Typography>thestep2</Typography>

            <PointsViewer
              buffer={() => wasm.the_step_2(1, 1, 1, roughness, 60)}
              itemSize={3}
              uniqueId="thestep2"
            />
          </Item>
        </Stack>
      </Stack>
    </div>
  );
};

export default Everything;
