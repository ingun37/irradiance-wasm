import {
  Color,
  DataTexture,
  LightProbe,
  LinearEncoding,
  SphericalHarmonics3,
  sRGBEncoding,
  Vector3,
  MathUtils,
} from "three";
import { DataUtils } from "./DataUtils";

export class LPG {
  static fromEquirect(equirect: DataTexture) {
    let totalWeight = 0;

    const dir = new Vector3();

    const color = new Color();

    const shBasis = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    const sh = new SphericalHarmonics3();
    const shCoefficients = sh.coefficients;

    const halfFloatRGBAData: Uint16Array = equirect.image.data as any;

    for (let i = 0; i < halfFloatRGBAData.length; i += 4) {
      color.setRGB(
        DataUtils.fromHalfFloat(halfFloatRGBAData[i]),
        DataUtils.fromHalfFloat(halfFloatRGBAData[i + 1]),
        DataUtils.fromHalfFloat(halfFloatRGBAData[i + 2])
      );
      convertColorToLinear(color, equirect.encoding);
      const u = ((i / 4) % equirect.image.width) / equirect.image.width;
      const v = i / 4 / equirect.image.width / equirect.image.height;
      dir.setFromSphericalCoords(1, Math.PI * v, Math.PI * 2 * (u - 0.5));
      //todo: set proper weight according to equirect

      // const weight = 1;
      // const weight = 4;
      const weight = Math.sin(v * Math.PI);
      totalWeight += weight;
      // evaluate SH basis functions in direction dir
      SphericalHarmonics3.getBasisAt(dir, shBasis);

      // accummuulate
      for (let j = 0; j < 9; j++) {
        shCoefficients[j].x += shBasis[j] * color.r * weight;
        shCoefficients[j].y += shBasis[j] * color.g * weight;
        shCoefficients[j].z += shBasis[j] * color.b * weight;
      }
    }

    // normalize
    const norm = (4 * Math.PI) / totalWeight;

    for (let j = 0; j < 9; j++) {
      shCoefficients[j].x *= norm;
      shCoefficients[j].y *= norm;
      shCoefficients[j].z *= norm;
    }

    return new LightProbe(sh);
  }
}

function convertColorToLinear(color, encoding) {
  switch (encoding) {
    case sRGBEncoding:
      color.convertSRGBToLinear();
      break;

    case LinearEncoding:
      break;

    default:
      console.warn(
        "WARNING: LightProbeGenerator convertColorToLinear() encountered an unsupported encoding."
      );
      break;
  }

  return color;
}
