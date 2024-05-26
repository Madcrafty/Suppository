import { ClassicPreset } from 'rete';
import { MathNode } from './MathNode'

export class AddNode extends MathNode {
    width=180;
    height=180;
    constructor() {
        super("Add");
    }
    data(inputs: any) {
        var result = super.calculate(inputs, 'a + b');
        (this.controls['result'] as ClassicPreset.InputControl<'number'>).setValue(result);
        return {
            value: result
        }
    }
}