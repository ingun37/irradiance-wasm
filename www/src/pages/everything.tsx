import * as React from "react";
import Stack from "@mui/material/Stack";
import DiffuseIrradiance from "./diffuse-irradiance";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import PointsViewer from "./points-viewer";
import * as wasm from "../../../pkg";
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
          <PointsViewer
            buffer={() => wasm.ggxs(1, 1, 1, 0.2, 60)}
            itemSize={3}
            uniqueId="ggxs"
          />
        </Item>
        <Item>
          <PointsViewer
            buffer={() => wasm.the_step(1, 1, 1, 0.2, 60)}
            itemSize={3}
            uniqueId="thestep"
          />
        </Item>
        <Item>
          <PointsViewer
            buffer={() => wasm.the_step_2(1, 1, 1, 0.2, 60)}
            itemSize={3}
            uniqueId="thestep2"
          />
        </Item>
      </Stack>
    </div>
  );
};

export default Everything;
