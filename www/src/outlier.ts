// import * as THREE from "three";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// import * as wasm from "irradiance-wasm";
// import { fetchSampleHDR } from "./util";
//
// export function outlierStuff(width: number, height: number, domID: string) {
//   const renderer = new THREE.WebGLRenderer();
//   renderer.setPixelRatio(window.devicePixelRatio);
//   renderer.setSize(width, height);
//   document.getElementById(domID).appendChild(renderer.domElement);
//
//   renderer.toneMapping = THREE.ReinhardToneMapping;
//   renderer.toneMappingExposure = 2.0;
//
//   renderer.outputEncoding = THREE.sRGBEncoding;
//
//   const scene = new THREE.Scene();
//
//   const aspect = width / height;
//
//   const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0, 1);
//   fetchSampleHDR()
//     .then(wasm.debug_image)
//     .then(URL.createObjectURL)
//     .then((uri) => {
//       new RGBELoader().load(uri, function (texture, textureData) {
//         //console.log( textureData );
//         //console.log( texture );
//
//         const material = new THREE.MeshBasicMaterial({ map: texture });
//
//         const quad = new THREE.PlaneGeometry(
//           (1.5 * (textureData as any).width) / (textureData as any).height,
//           1.5
//         );
//
//         const mesh = new THREE.Mesh(quad, material);
//
//         scene.add(mesh);
//
//         renderer.toneMappingExposure = 2;
//
//         renderer.render(scene, camera);
//       });
//     });
// }
