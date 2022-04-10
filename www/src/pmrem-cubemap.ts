import * as THREE from "three";
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  ShaderMaterial,
  TorusKnotGeometry,
  WebGLRenderer,
} from "three";
// import { DebugEnvironment } from "three/examples/jsm/environments/DebugEnvironment";
// import { HDRCubeTextureLoader } from "three/examples/jsm/loaders/HDRCubeTextureLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { PMREMCubeMapGenerator } from "./CustomPMREMGenerator";

export function pmremCubemap(width: number, height: number, domID: string) {
  const camera = new PerspectiveCamera(40, width / height, 1, 1000);
  camera.position.set(0, 0, 8);
  const scene = new Scene();
  scene.background = new Color(0xf00000);

  const renderer = new WebGLRenderer();
  document.getElementById(domID).appendChild(renderer.domElement);

  renderer.physicallyCorrectLights = true;
  renderer.toneMapping = ACESFilmicToneMapping;

  const pmremGenerator = new PMREMCubeMapGenerator(renderer);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  const render = () => {
    requestAnimationFrame(() => renderer.render(scene, camera));
  };
  new RGBELoader().load("venetian_crossroads_1k.hdr", (dataTexture) => {
    // hdrCubeMap.magFilter = THREE.LinearFilter;
    // hdrCubeMap.needsUpdate = true;

    const renderTarget = pmremGenerator.fromEquirectangular(dataTexture);
    // const cubeMap = hdrCubeMap;
    const newEnvMap = renderTarget ? pmremGenerator.dataCubeTexture : null;

    // console.log(renderTarget.texture.mipmaps);
    const mat = new ShaderMaterial({
      vertexShader: `
                  varying vec3 vOutputDirection;

      void main() {
                  	vOutputDirection = position;

      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
      }
      `,
      fragmentShader: `
      	varying vec3 vOutputDirection;
      	uniform samplerCube env;
        void main() {
          // gl_FragColor = textureCubeLodEXT(env, normalize(vOutputDirection), 4.0);
          gl_FragColor = textureCube(env, normalize(vOutputDirection));
        }
      `,
      uniforms: {
        env: { value: newEnvMap },
      },
    });

    const mat2 = new ShaderMaterial({
      vertexShader: `
                  varying vec3 vOutputDirection;

      void main() {
                  	vOutputDirection = position;

      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
      }
      `,
      fragmentShader: `
      	varying vec3 vOutputDirection;
      	uniform samplerCube env;
        void main() {
          gl_FragColor = textureCube(env, normalize(vOutputDirection));
        }
      `,
      uniforms: {
        env: { value: newEnvMap.mipmaps[0] },
      },
    });
    console.log(newEnvMap);
    const mipmaptest = new Mesh(new BoxGeometry(), mat);
    mipmaptest.translateX(-1);

    scene.add(mipmaptest);

    const subMipmapTest = new Mesh(new BoxGeometry(), mat2);
    subMipmapTest.translateX(1);
    scene.add(subMipmapTest);
    // scene.background = cubeMap;
    renderer.toneMappingExposure = 1;
    render();
  });

  //renderer.toneMapping = ReinhardToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1;
  controls.maxDistance = 300;
  controls.addEventListener("change", render);
}
