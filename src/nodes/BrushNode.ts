import { ClassicPreset as Classic, GetSchemes, NodeEditor } from 'rete';
import {parameters} from '../../brush/parameters.js';
import { DataflowEngine } from 'rete-engine';
import {NumSocket} from "../sockets/NumSocket.js"
import { Schemes } from '../rete/schemes.js';
import * as THREE from 'three';

export class BrushNode extends Classic.Node {
    width = 180;
    height = 335;
  
    constructor(private dataflow: DataflowEngine<Schemes>) {
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
    data() {
      this.update();
      return {};
    }
    async update() {
      const inputs = await this.dataflow.fetchInputs(this.id);
      parameters.brushSize = (inputs[0]!=undefined) ? inputs[0] : parameters.brushSize;
      parameters.brushAlpha = (inputs[1]!=undefined) ? inputs[1] : parameters.brushAlpha;
      parameters.brushHeight = (inputs[2]!=undefined) ? inputs[2] : parameters.brushHeight;
      parameters.brushKern = (inputs[3]!=undefined) ? inputs[3] : parameters.brushKern;
      parameters.brushShine = (inputs[4]!=undefined) ? inputs[4] : parameters.brushShine;
      parameters.brushColor = (inputs[5]!=undefined && inputs[6]!=undefined && inputs[7]!=undefined) ? new THREE.Color(inputs[5],inputs[6],inputs[7]) : parameters.brushColor;
      parameters.update();
    }
  }