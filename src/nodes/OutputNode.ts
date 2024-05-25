import { ClassicPreset as Classic, GetSchemes, NodeEditor } from 'rete';
import {parameters} from '../../brush/parameters.js';
import {NumSocket} from "./sockets"
import * as THREE from 'three';

export class OutputNode extends Classic.Node {
    width = 180;
    height = 335;
  
    constructor() {
      super('Brush');
  
      this.addInput('a', new Classic.Input(new NumSocket(), 'Size'));
      this.addInput('b', new Classic.Input(new NumSocket(), 'Alpha'));
      this.addInput('c', new Classic.Input(new NumSocket(), 'Height'));
      this.addInput('d', new Classic.Input(new NumSocket(), 'Kern'));
      this.addInput('e', new Classic.Input(new NumSocket(), 'Shine'));
      // color
      this.addInput('f', new Classic.Input(new NumSocket(), 'Red'));
      this.addInput('g', new Classic.Input(new NumSocket(), 'Green'));
      this.addInput('h', new Classic.Input(new NumSocket(), 'Blue'));
    }
    data(inputs: { a?: number[]; b?: number[]; c?: number[]; d?: number[]; e?: number[]; f?: number[]; g?: number[]; h?: number[];}) {
      const { a = [], b = [], c = [],d = [],e = [],f = [],g = [],h = [],} = inputs;
      parameters.brushSize = (a[0]!=undefined) ? a[0] : parameters.brushSize;
      parameters.brushAlpha = (b[0]!=undefined) ? b[0] : parameters.brushAlpha;
      parameters.brushHeight = (c[0]!=undefined) ? c[0] : parameters.brushHeight;
      parameters.brushKern = (d[0]!=undefined) ? d[0] : parameters.brushKern;
      parameters.brushShine = (e[0]!=undefined) ? e[0] : parameters.brushShine;
      parameters.brushColor = (f[0]!=undefined && g[0]!=undefined && h[0]!=undefined) ? new THREE.Color(f[0],g[0],h[0]) : parameters.brushColor;
      parameters.update();
      return {};
    }
  }