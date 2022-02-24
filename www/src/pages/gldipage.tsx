import * as React from "react";
import { useEffect } from "react";
import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { makeIndicator } from "../util";
import { equirectToCubemap, loadRGBE } from "../di";
import { LightProbeHelper } from "three/examples/jsm/helpers/LightProbeHelper";
import { LightProbeGenerator } from "three/examples/jsm/lights/LightProbeGenerator";

const uniqueId = "gldipage";
const consts = {
  height: 512,
  width: 512,
};
export default function Gldipage() {
  useEffect(() => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      consts.width / consts.height,
      0.1,
      1000
    );
    const renderer = new WebGLRenderer();
    renderer.setSize(consts.width, consts.height);
    document.getElementById(uniqueId).appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", () => renderer.render(scene, camera));
    loadRGBE()
      .then(equirectToCubemap(128, renderer))
      .then((rt) => {
        scene.background = rt.texture;
        // scene.add(new Mesh(new BoxGeometry(), new MeshPhongMaterial()));
        // scene.add(new AmbientLight());
        const l = LightProbeGenerator.fromCubeRenderTarget(renderer, rt);
        scene.add(new LightProbeHelper(l, 1));
        // scene.add(
        //   new LightProbeHelper(
        //     LightProbeGenerator.fromCubeTexture(cubeTexture),
        //     1
        //   )
        // );
        scene.add(makeIndicator());
        camera.translateZ(10);

        requestAnimationFrame(() => renderer.render(scene, camera));
      });
  }, []);
  return (
    <div
      id={uniqueId}
      style={{
        height: consts.height.toString() + "px",
        width: consts.width.toString() + "px",
      }}
    />
  );
}
