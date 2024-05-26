import { MathNode } from './MathNode'

export class AddNode extends MathNode {
    width=180;
    height=180;
    constructor() {
        super("Add");
    }
    data(inputs: any) {
        return {
            value: super.calculate(inputs, 'a + b')
        }
    }
}