import * as React from "react";
import { useEffect } from "react";
import { array } from "fp-ts";
import { Observable, Subject } from "rxjs";
export default function ThreeDebug(props: {
  domID?: string;
  eff: (
    w: number,
    h: number,
    domID: string,
    onClick: Observable<[number, number]>
  ) => any;
  width?: number;
  height?: number;
}) {
  const domID =
    props.domID ?? "dom" + Math.floor(Math.random() * 100000).toString();
  const width = props.width ?? 512;
  const height = props.height ?? 512;
  const clicks = new Subject<[number, number]>();
  useEffect(() => {
    props.eff(width, height, domID, clicks);
  }, []);
  return (
    <div
      style={{
        height: height.toString() + "px",
        width: width.toString() + "px",
        position: "relative",
      }}
    >
      <div
        id={domID}
        style={{
          height: height.toString() + "px",
          width: width.toString() + "px",
        }}
        onPointerUp={(evt) => {
          const rect = (evt.target as HTMLElement).getBoundingClientRect();
          const xy: [number, number] = [
            ((evt.clientX - rect.left) / rect.width) * 2 - 1,
            -(((evt.clientY - rect.top) / rect.height) * 2 - 1),
          ];
          clicks.next(xy);

          // console.log(xy);
        }}
      />
    </div>
  );
}
