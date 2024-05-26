import { ClassicPreset } from 'rete';
import sockets from '../../rete/sockets';
import { globals } from '../../../globals';

export class MathNode extends ClassicPreset.Node {
    constructor(label:string) {
        super(label);
        this.addInput('value1', new ClassicPreset.Input(sockets.val, 'Value'));
        this.addInput('value2', new ClassicPreset.Input(sockets.val, 'Value'));
        this.addOutput('value', new ClassicPreset.Output(sockets.val, 'Value'));
        this.addControl('result',new ClassicPreset.InputControl('number', { initial: 0, readonly: true }));
    }
    getFunction(expression: any) {
        const f = new Function('sqrt, abs, a, b', 'return ' + expression);

        return f.bind(null, Math.sqrt, Math.abs);
    }
    
    order(a: any, b: any) {
        if (a instanceof Uint8ClampedArray)
            return [a, b]

        if (b instanceof Uint8ClampedArray)
            return [b, a]
        return [a, b]
    }

    calculate(inputs: any, expression: any) {
        const [a, b] = this.order(inputs['value1'] && inputs['value1'][0], inputs['value2'] && inputs['value2'][0]);
        const f = this.getFunction(expression);

        if (typeof a === 'number')
            return f(a, b);

        if (a instanceof Uint8ClampedArray) {
            const result = new Uint8ClampedArray();
            if(b instanceof Uint8ClampedArray) {
                for (var x = 0; x < globals.textureRes; x++) {                  
                    for (var y = 0; y < globals.textureRes; y++) {
                        var cell = (x + y * globals.textureRes) * 4;
                        result[cell] = f(a[cell], b[cell]);   
                        result[cell + 1] = f(a[cell+1], b[cell+1]);    
                        result[cell + 2] = f(a[cell+2], b[cell+2]);    
                        result[cell + 3] = f(a[cell+3], b[cell+3]);     
                    }
                }
            } else {
                for (var x = 0; x < globals.textureRes; x++) {                  
                    for (var y = 0; y < globals.textureRes; y++) {
                        var cell = (x + y * globals.textureRes) * 4;
                        result[cell] = f(a[cell], b);   
                        result[cell + 1] = f(a[cell+1], b);    
                        result[cell + 2] = f(a[cell+2], b);    
                        result[cell + 3] = f(a[cell+3], b);     
                    }
                }
            }
            return result;
        }
        return {};
    }
}