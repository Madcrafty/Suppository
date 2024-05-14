import { ClassicPreset as Classic, GetSchemes, NodeEditor } from 'rete';
import {NumSocket} from "../sockets/NumSocket.js"

export class NumberNode extends Classic.Node {
    width = 180;
    height = 120;
  
    constructor(initial: number, change?: (value: number) => void) {
      super('Number');
  
      this.addOutput('value', new Classic.Output(new NumSocket(), 'Number'));
      this.addControl(
        'value',
        new Classic.InputControl('number', { initial, change })
      );
    }
    data() {
      const value = (this.controls['value'] as Classic.InputControl<'number'>).value;
  
      return {value,};
    }
  }