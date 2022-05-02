import * as THREE from "three";
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  Color,
  DirectionalLight,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
// import { DebugEnvironment } from "three/examples/jsm/environments/DebugEnvironment";
// import { HDRCubeTextureLoader } from "three/examples/jsm/loaders/HDRCubeTextureLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { PMREMCubeMapGenerator } from "pmrem-cubemap-generator";

export function pmremCubemap(width: number, height: number, domID: string) {
  const f = 150 / 255;
  const l = new Color().setRGB(f, f, f, "srgb-linear");
  const s = new Color().setRGB(f, f, f, "srgb");
  console.log(f, l, s);
  // console.log(
  //   "linear vari",
  //   l.clone().convertLinearToSRGB(),
  //   l.clone().convertSRGBToLinear()
  // );
  //
  // console.log(
  //   "srgb vari",
  //   s.clone().convertLinearToSRGB(),
  //   s.clone().convertSRGBToLinear()
  // );
  const camera = new PerspectiveCamera(40, width / height, 1, 1000);
  camera.position.set(0, 0, 8);
  const scene = new Scene();
  scene.background = new Color(0xf00000);

  const renderer = new WebGLRenderer();
  document.getElementById(domID).appendChild(renderer.domElement);

  renderer.physicallyCorrectLights = false;
  // renderer.toneMapping = ACESFilmicToneMapping;

  const pmremGenerator = new PMREMCubeMapGenerator(renderer);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  const render = () => {
    requestAnimationFrame(() => renderer.render(scene, camera));
  };

  scene.add(new DirectionalLight(l));
  scene.add(new DirectionalLight(l));

  new RGBELoader().load("venetian_crossroads_1k.hdr", (dataTexture) => {
    // hdrCubeMap.magFilter = THREE.LinearFilter;
    // hdrCubeMap.needsUpdate = true;

    const dataCubeTexture = pmremGenerator.fromEquirectangular(dataTexture);
    // const cubeMap = hdrCubeMap;
    const newEnvMap = dataCubeTexture ?? null;

    // console.log(renderTarget.texture.mipmaps);
    const mat = new ShaderMaterial({
      lights: true,
      vertexShader: `
                  varying vec3 vOutputDirection;

      void main() {
                  	vOutputDirection = position;

      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
      }
      `,
      fragmentShader: `
        #include <common>
      #include <lights_pars_begin>

      	varying vec3 vOutputDirection;
      	uniform samplerCube env;
        void main() {
          vec3 aaa = directionalLights[0].color;
          gl_FragColor = textureCubeLodEXT(env, normalize(vOutputDirection), 4.0) + vec4(aaa,1.0);
          // gl_FragColor = textureCube(env, normalize(vOutputDirection));
        }
      `,
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib["lights"],
        {
          env: { value: newEnvMap },
        },
      ]),
    });

    const mipmaptest = new Mesh(new BoxGeometry(), mat);
    mipmaptest.translateX(-1);

    scene.add(mipmaptest);

    // const mat2 = new ShaderMaterial({
    //   vertexShader: `
    //               varying vec3 vOutputDirection;
    //
    //   void main() {
    //               	vOutputDirection = position;
    //
    //   gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
    //   }
    //   `,
    //   fragmentShader: `
    //   	varying vec3 vOutputDirection;
    //   	uniform samplerCube env;
    //     void main() {
    //       gl_FragColor = textureCube(env, normalize(vOutputDirection));
    //     }
    //   `,
    //   uniforms: {
    //     env: { value: newEnvMap.mipmaps[1] },
    //   },
    // });
    // const subMipmapTest = new Mesh(new BoxGeometry(), mat2);
    // subMipmapTest.translateX(1);
    // scene.add(subMipmapTest);
    // scene.background = cubeMap;
    renderer.toneMappingExposure = 1;
    render();
  });

  //renderer.toneMapping = ReinhardToneMapping;
  // renderer.outputEncoding = THREE.sRGBEncoding;
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1;
  controls.maxDistance = 300;
  controls.addEventListener("change", render);
}
