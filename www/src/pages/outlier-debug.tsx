import * as React from "react";
import { useEffect } from "react";
// import { outlierStuff } from "../outlier";

export default function OutlierDebug() {
  const domID = "outlierdebug";
  const width = 512;
  const height = 512;
  useEffect(() => {
    // outlierStuff(width, height, domID);
    // pmrem(width, height, domID);
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
