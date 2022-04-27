import * as React from "react";
import { useEffect } from "react";
export default function ThreeDebug(props: {
  domID?: string;
  eff: (w: number, h: number, domID: string) => any;
  width?: number;
  height?: number;
}) {
  const domID =
    props.domID ?? "dom" + Math.floor(Math.random() * 100000).toString();
  const width = props.width ?? 512;
  const height = props.height ?? 512;
  useEffect(() => {
    props.eff(width, height, domID);
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
