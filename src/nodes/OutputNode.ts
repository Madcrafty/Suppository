import { ClassicPreset as Classic } from 'rete';
import sockets from '../rete/sockets';
import {material} from "../../brush/material"

export class OutputNode extends Classic.Node {
    width = 180;
    height = 180;
  
    constructor() {
      super('Output');
  
      this.addInput('Texture', new Classic.Input(sockets.tex, 'Texture'));
      this.addInput('Height', new Classic.Input(sockets.tex, 'Height'));
      this.addInput('Shine', new Classic.Input(sockets.tex, 'Shine'));
    }
    data(inputs: any) {
      material.brushTexture = inputs['Texture'] && inputs['Texture'][0] instanceof Uint8ClampedArray ? <Uint8ClampedArray>inputs['Texture'][0] : material.brushTexture;
      material.heightTexture = inputs['Height'] && inputs['Height'][0] instanceof Uint8ClampedArray ? <Uint8ClampedArray>inputs['Height'][0] : material.heightTexture;
      material.shineTexture = inputs['Shine'] && inputs['Shine'][0] instanceof Uint8ClampedArray ? <Uint8ClampedArray>inputs['Shine'][0] : material.shineTexture;

      return {};
    }
  }