import {
  DataTexture,
  Mesh,
  OrthographicCamera,
  PlaneBufferGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

function loadRGBE() {
  return new Promise<DataTexture>((done) => {
    new RGBELoader().load("venetian_crossroads_1k.hdr", done);
  });
}
export function compileDiffuseIrradianceTexture(
  width: number,
  height: number,
  renderer: WebGLRenderer
) {
  const camera = new OrthographicCamera(-1, 1, 1, -1);
  camera.translateZ(10);
  camera.lookAt(0, 0, 0);

  const vcode = fetch("/di_vert.glsl").then((x) => x.text());
  const fcode = fetch("/di_frag.glsl").then((x) => x.text());
  return Promise.all([vcode, fcode]).then(([vertexShader, fragmentShader]) => {
    return loadRGBE().then((rgbe) => {
      const m = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          env: { value: rgbe },
        },
      });

      const g = new PlaneBufferGeometry(2, 2);
      const mesh = new Mesh(g, m);
      const s = new Scene();
      s.add(mesh);
      const rt = new WebGLRenderTarget(width, height, {});
      const prevRT = renderer.getRenderTarget();
      renderer.setRenderTarget(rt);
      renderer.render(s, camera);
      renderer.setRenderTarget(prevRT);

      return rt.texture;
    });
  });
}
