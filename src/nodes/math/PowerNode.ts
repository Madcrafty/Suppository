import { ClassicPreset } from 'rete';
import { MathNode } from './MathNode'

export class PowerNode extends MathNode {
    width=180;
    height=180;
    constructor() {
        super("Power");
    }
    data(inputs: any) {
        var result = super.calculate(inputs, 'pow(a, b)');
        (this.controls['result'] as ClassicPreset.InputControl<'number'>).setValue(result);
        return {
            value:result
        }
    }
}