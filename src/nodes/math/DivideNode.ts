import { ClassicPreset } from 'rete';
import { MathNode } from './MathNode'
import { Preview } from '../../controls/preview';

export class DivideNode extends MathNode {
    width=180;
    height=360;
    constructor() {
        super("Divide");
    }
    data(inputs: any) {
        var result = super.calculate(inputs, 'a / b');
        (this.controls['result'] as ClassicPreset.InputControl<'number'>).setValue(result);
        this.texture = result !== null && result instanceof Int16Array ? result : this.makeTextureFromNumber(result);
      (this.controls['preview'] as Preview).setTexture(this.texture);
        return {
            value: result
        }
    }
}