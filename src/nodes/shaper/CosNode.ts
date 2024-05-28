import { ClassicPreset } from 'rete';
import { Preview } from '../../controls/preview';
import { ShaperNode } from './ShaperNode';

export class CosNode extends ShaperNode {
    constructor() {
        super("Cos");
    }
    data(inputs: any) {
        this.alpha = inputs['alpha'] && inputs['alpha'][0] instanceof Int16Array ? inputs['alpha'][0] : null;
        var result = super.calculate(inputs, 'cos(a)');
        (this.controls['result'] as ClassicPreset.InputControl<'number'>).setValue(result);
        this.texture = result !== null && result instanceof Int16Array ? result : this.makeTextureFromNumber(result);
      (this.controls['preview'] as Preview).setTexture(this.texture);
        return {
            value: result
        }
    }
}