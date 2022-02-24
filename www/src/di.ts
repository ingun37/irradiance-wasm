import {
  BackSide,
  BoxBufferGeometry,
  CubeCamera,
  CubeTexture,
  DataTexture,
  Mesh,
  Scene,
  ShaderMaterial,
  WebGLCubeRenderTarget,
  WebGLRenderer,
} from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

export function loadRGBE() {
  return new Promise<DataTexture>((done) => {
    new RGBELoader().load("venetian_crossroads_1k.hdr", done);
  });
}

export function equirectToCubemap(size: number, renderer: WebGLRenderer) {
  const vcode = fetch("/di_vert.glsl").then((x) => x.text());
  const fcode = fetch("/di_frag.glsl").then((x) => x.text());
  return (equirect: DataTexture) =>
    Promise.all([vcode, fcode]).then(([vertexShader, fragmentShader]) => {
      const m = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          env: { value: equirect },
        },
        side: BackSide,
      });

      const g = new BoxBufferGeometry();
      const mesh = new Mesh(g, m);
      // mesh.rotateY(Math.PI);
      // mesh.translateZ(1);
      const s = new Scene();
      s.add(mesh);
      const rt = new WebGLCubeRenderTarget(size, { generateMipmaps: false });
      const camera = new CubeCamera(0.1, 100, rt);
      s.add(camera);
      return new Promise<CubeTexture>((done) => {
        requestAnimationFrame(() => {
          camera.update(renderer, s);
          // renderer.render(s, camera);

          done(rt.texture);
        });
      });
    });
}
