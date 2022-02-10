import * as React from "react";
import { useEffect } from "react";
import { pmrem } from "../pmrem";
export default function PMREMDebug() {
  const domID = "pmremdebug";
  const width = 512;
  const height = 512;
  useEffect(() => {
    pmrem(width, height, domID);
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
