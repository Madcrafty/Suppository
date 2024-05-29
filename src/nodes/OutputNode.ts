import { ClassicPreset as Classic } from 'rete';
import sockets from '../rete/sockets';
import {material} from "../../brush/material"
import * as utils from "../../misc/utils"
export class OutputNode extends Classic.Node {
    width = 180;
    height = 180;
  
    constructor() {
      super('Output');
  
      this.addInput('texture', new Classic.Input(sockets.tex, 'Texture'));
      this.addInput('height', new Classic.Input(sockets.tex, 'Height'));
      this.addInput('shine', new Classic.Input(sockets.tex, 'Shine'));
      this.addInput('alpha', new Classic.Input(sockets.tex, 'Alpha'));

    }
    data(inputs: any) {
      material.brushTexture = inputs['texture'] && inputs['texture'][0] instanceof Int16Array ? utils.int16touint8(inputs['texture'][0]) : material.brushTexture;
      material.heightTexture = inputs['height'] && inputs['height'][0] instanceof Int16Array ? inputs['height'][0] : material.heightTexture;
      material.shineTexture = inputs['shine'] && inputs['shine'][0] instanceof Int16Array ? inputs['shine'][0] : material.shineTexture;
      material.alphaTexture = inputs['alpha'] && inputs['alpha'][0] instanceof Int16Array ? inputs['alpha'][0] : material.alphaTexture;
      return {};
    }
  }