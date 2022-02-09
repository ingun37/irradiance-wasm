import * as React from "react";
import { Box, Link, Typography } from "@mui/material";
export default function Header() {
  return (
    <Box textAlign="center">
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
    </Box>
  );
}
