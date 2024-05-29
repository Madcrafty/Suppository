import { ClassicPreset as Classic } from 'rete';
import sockets from '../rete/sockets';
import {material} from "../../brush/material"
import * as utils from "../../misc/utils"
export class OutputNode extends Classic.Node {
    width = 180;
    height = 220;
  
    constructor() {
      super('Output');
  
      this.addInput('texture', new Classic.Input(sockets.tex, 'Texture'));
      this.addInput('height', new Classic.Input(sockets.tex, 'Height'));
      this.addInput('rough', new Classic.Input(sockets.tex, 'Rough'));
      this.addInput('metal', new Classic.Input(sockets.tex, 'Metal'));
      this.addInput('alpha', new Classic.Input(sockets.tex, 'Alpha'));

    }
    data(inputs: any) {
      material.brushTexture = inputs['texture'] && inputs['texture'][0] instanceof Int16Array ? utils.int16touint8(inputs['texture'][0]) : material.brushTexture;
      material.heightTexture = inputs['height'] && inputs['height'][0] instanceof Int16Array ? inputs['height'][0] : material.heightTexture;
      material.roughTexture = inputs['rough'] && inputs['rough'][0] instanceof Int16Array ? inputs['rough'][0] : material.roughTexture;
      material.metalTexture = inputs['metal'] && inputs['metal'][0] instanceof Int16Array ? inputs['metal'][0] : material.metalTexture;
      material.alphTexture = inputs['alpha'] && inputs['alpha'][0] instanceof Int16Array ? inputs['alpha'][0] : material.alphTexture;
      return {};
    }
  }