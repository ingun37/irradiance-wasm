import * as React from "react";
import Stack from "@mui/material/Stack";
import DiffuseIrradiance from "./diffuse-irradiance";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import PointsViewer from "./points-viewer";
import * as wasm from "../../../pkg";
import { roughness } from "../consts";
import { Typography } from "@mui/material";
import PreFilteredSpecular from "./pre-filtered-specular";
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  // width: "300px",
  // height: "300px",
}));

const Everything = () => {
  return (
    <div>
      <DiffuseIrradiance />
      <PreFilteredSpecular />
      {/*<FibonacciSphere />*/}
      <PointsViewer
        buffer={() => wasm.fibonacci_hemi_sphere(300)}
        itemSize={3}
        uniqueId="fibo"
      />
      <PointsViewer
        buffer={() => wasm.hammersleys(300)}
        itemSize={2}
        uniqueId="hammersly"
      />

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
    </div>
  );
};

export default Everything;
