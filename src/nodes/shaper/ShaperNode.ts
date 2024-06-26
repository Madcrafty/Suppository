import { ClassicPreset } from 'rete';
import sockets from '../../rete/sockets';
import { globals } from '../../../globals';
import { Preview } from '../../controls/preview';

export class ShaperNode extends ClassicPreset.Node {
    texture: null | Int16Array = null;
    alpha: null | Int16Array = null;
    width = 180;
    height = 350;
    constructor(label:string) {
        super(label);
        this.addInput('input', new ClassicPreset.Input(sockets.val, 'Value'));
        this.addControl('preview', new Preview());
        this.addInput('alpha', new ClassicPreset.Input(sockets.tex, "Alpha"));
        this.addOutput('value', new ClassicPreset.Output(sockets.val, 'Value'));
        this.addControl('result',new ClassicPreset.InputControl('number', { initial: 0, readonly: true }));
        if(!this.texture) return;
        (this.controls['preview'] as Preview).setTexture(this.texture);
    }
    makeTextureFromNumber(result:number) {
        //Assumes RGBA
        var tex = new Int16Array(globals.textureSize);
        for (var y = 0; y < globals.textureRes; y++) {
          for (var x = 0; x < globals.textureRes; x++){
                var cell = (x + y * globals.textureRes) * 4;
                if(this.alpha) {
                    var alpha = (this.alpha[cell] + this.alpha[cell+1] + this.alpha[cell+2])/3;
                  } else {
                    var alpha = 255;
                  }
                tex[cell] = result;   
                tex[cell + 1] = result;   
                tex[cell + 2] = result;   
                tex[cell + 3] = alpha;   
            }
        }
        return tex;
    }
    getFunction(expression: any) {
        const f = new Function('sqrt, abs, sin, cos, tan, a', 'return ' + expression);

        return f.bind(null, Math.sqrt, Math.abs, Math.sin, Math.cos, Math.tan);
    }

    calculate(inputs: any, expression: any) {
        const a = inputs['input'] && inputs['input'][0]
        const f = this.getFunction(expression);

        if (typeof a === 'number') {
            return f(a);
        }

        if (a instanceof Int16Array) {
            const result = new Int16Array(globals.textureSize);
            for (var x = 0; x < globals.textureRes; x++) {                  
                for (var y = 0; y < globals.textureRes; y++) {
                    var cell = (x + y * globals.textureRes) * 4;
                    if(this.alpha) {
                        var alpha = (this.alpha[cell] + this.alpha[cell+1] + this.alpha[cell+2])/3;
                      } else {
                        var alpha = 255;
                      }
                    result[cell] = f((a[cell])/255)*255;   
                    result[cell + 1] = f(a[cell+1]/255)*255;    
                    result[cell + 2] = f(a[cell+2]/255)*255;    
                    result[cell + 3] = alpha;
                }
            }
            return result;
        }
        return {};
    }
}
