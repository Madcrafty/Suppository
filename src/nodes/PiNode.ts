import { ClassicPreset as Classic, GetSchemes, NodeEditor } from 'rete';
import sockets from '../rete/sockets';

export class PiNode extends Classic.Node {
    width = 180;
    height = 120;
  
    constructor() {
      super('PI');
  
      this.addOutput('value', new Classic.Output(sockets.num, 'Number'));
      this.addControl('value',new Classic.InputControl('number', { initial:Math.PI, readonly:true }));
    }
    data() {  
      return {value:Math.PI,};
    }
  }