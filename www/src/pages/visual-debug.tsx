import * as React from "react";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";
import PointsViewer from "./points-viewer";
import * as wasm from "../../../pkg";
import { roughness } from "../consts";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  // width: "300px",
  // height: "300px",
}));

export default function VisualDebug() {
  return (
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
  );
}
