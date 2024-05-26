import { ClassicPreset as Classic, GetSchemes, NodeEditor } from 'rete';
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
      const texture = inputs['Texture'] && inputs['Texture'][0] instanceof Uint8ClampedArray ? inputs['Texture'][0] : new Uint8ClampedArray();
      const htexture = inputs['Height'] && inputs['Height'][0] instanceof Uint8ClampedArray ? inputs['Height'][0] : new Uint8ClampedArray();
      material.brushTexture = texture;
      material.heightTexture = htexture;
      return {};
    }
  }