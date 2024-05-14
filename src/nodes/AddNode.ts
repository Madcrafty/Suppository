import { ClassicPreset as Classic, GetSchemes, NodeEditor } from 'rete';
import {NumSocket} from "../sockets/NumSocket.js"

export class AddNode extends Classic.Node {
    width = 180;
    height = 195;
  
    constructor() {
      super('Add');
  
      this.addInput('a', new Classic.Input(new NumSocket(), 'A'));
      this.addInput('b', new Classic.Input(new NumSocket(), 'B'));
      this.addOutput('value', new Classic.Output(new NumSocket(), 'Number'));
      this.addControl(
        'result',
        new Classic.InputControl('number', { initial: 0, readonly: true })
      );
    }
    data(inputs: { a?: number[]; b?: number[] }) {
      const { a = [], b = [] } = inputs;
      const sum = (a[0] || 0) + (b[0] || 0);
  
      (this.controls['result'] as Classic.InputControl<'number'>).setValue(sum);
  
      return {
        value: sum,
      };
    }
  }