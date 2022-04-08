import * as React from "react";
import { useEffect } from "react";
import { createplanes } from "../createplanes";
export default function CreatePlanesDebug() {
  const domID = "createplanesdebug";
  const width = 512;
  const height = 512;
  useEffect(() => {
    createplanes(width, height, domID);
  }, []);
  return (
    <div
      id={domID}
      style={{
        height: height.toString() + "px",
        width: width.toString() + "px",
      }}
    />
  );
}
