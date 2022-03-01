import * as React from "react";
import { useEffect } from "react";
import {
  DataTexture,
  Mesh,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  ShaderMaterial,
  SphereBufferGeometry,
  WebGLRenderer,
} from "three";
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
    scene.add(makeIndicator());
    camera.translateZ(10);

    const renderer = new WebGLRenderer();
    renderer.setSize(consts.width, consts.height);
    document.getElementById(uniqueId).appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", () =>
      requestAnimationFrame(() => renderer.render(scene, camera))
    );
    loadRGBE().then((equirect) => {
      Promise.resolve(equirect)
        .then(equirectToCubemap(128, renderer))
        .then((rt) => {
          scene.background = rt.texture;

          const l = LightProbeGenerator.fromCubeRenderTarget(renderer, rt);
          const h = new LightProbeHelper(l, 1);
          scene.add(h);

          requestAnimationFrame(() => renderer.render(scene, camera));
        });

      Promise.resolve(equirect)
        .then(equirectToPMREM(renderer))
        .then((t) => {
          // t.mapping = CubeUVRefractionMapping;
          const m = new Mesh(
            new SphereBufferGeometry(),
            new ShaderMaterial({
              vertexShader: thevert,
              fragmentShader: thefrag,
              defines: {
                ENVMAP_TYPE_CUBE_UV: true,
              },
              uniforms: {
                env: {
                  value: t,
                },
              },
            })
          );

          m.translateX(3);

          scene.add(m);
        });
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

const thevert = `
varying vec3 vOutputDirection;

void main() {
    vec4 world = modelMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * viewMatrix * world;
    vOutputDirection = position;
}
`;

const thefrag = `
#include <cube_uv_reflection_fragment>

varying vec3 vOutputDirection;
uniform sampler2D env;

void main() {
  gl_FragColor = textureCubeUV(env, vOutputDirection, 0.1);
}
`;
function equirectToPMREM(renderer: WebGLRenderer) {
  const pmrem = new PMREMGenerator(renderer);
  return (equirect: DataTexture) => {
    const rt = pmrem.fromEquirectangular(equirect);
    return rt.texture;
  };
}
