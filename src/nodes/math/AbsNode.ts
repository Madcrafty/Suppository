import { ClassicPreset } from 'rete';
import { Preview } from '../../controls/preview';
import { ShaperNode } from './ShaperNode';

export class AbsNode extends ShaperNode {
    width=180;
    height=320;
    constructor() {
        super("Abs");
    }
    data(inputs: any) {
        var result = super.calculate(inputs, 'abs(a)');
        (this.controls['result'] as ClassicPreset.InputControl<'number'>).setValue(result);
        this.texture = result !== null && result instanceof Int16Array ? result : this.makeTextureFromNumber(result);
      (this.controls['preview'] as Preview).setTexture(this.texture);
        return {
            value: result
        }
    }
}