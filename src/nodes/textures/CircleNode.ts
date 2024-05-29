import { ClassicPreset as Classic, GetSchemes, NodeEditor } from 'rete';
import {globals} from "../../../globals";
import { TextureNode } from './TextureNode';
import { Preview } from '../../controls/preview';
import sockets from '../../rete/sockets';

export class CircleNode extends Classic.Node {
    size:number=1;
    width = 180;
    height = 300;
    texture: null | Int16Array = null;
    alpha: null | Int16Array = null;
    constructor(initial:number, change?: () => void) {
        super("Circle");  
        this.size=initial;
        this.addControl('preview', new Preview());
        this.addControl('size',new Classic.InputControl('number', { initial:this.size, change }));
        this.addOutput('value', new Classic.Output(sockets.tex, 'Texture'));
        this.addInput('alpha', new Classic.Input(sockets.tex, "Alpha"));
        this.makeTexture();
        if(!this.texture) return;
        (this.controls['preview'] as Preview).setTexture(this.texture);
    }
    makeTexture() {
        this.texture=new Int16Array(globals.textureSize);
        for (var y = 0; y < globals.textureRes; y++) {
            for (var x = 0; x < globals.textureRes; x++){

                var cell = (x + y * globals.textureRes) * 4;
                var xval = (x/globals.textureRes);
                var yval = 1-(y/globals.textureRes);
                var val = 0;
                if(((xval-0.5)*(xval-0.5))+((yval-0.5)*(yval-0.5)) <= (this.size*this.size)) {
                    val = 255;
                }
                if(this.alpha) {
                    var alpha = (this.alpha[cell] + this.alpha[cell+1] + this.alpha[cell+2])/3;
                  } else {
                    var alpha = 255;
                  }
                this.texture[cell] = val;   
                this.texture[cell + 1] = val;   
                this.texture[cell + 2] = val;   
                this.texture[cell + 3] = alpha;   
            }
        }
    }
    data (inputs: any) {
        if(!this.texture) return {};
        const size = (this.controls['size'] as Classic.InputControl<'number'>).value;
        this.size = (size!=null) ? size : this.size;        
        this.alpha = inputs['alpha'] && inputs['alpha'][0] instanceof Int16Array ? inputs['alpha'][0] : null;
        this.makeTexture();
        (this.controls['preview'] as Preview).setTexture(this.texture);
        return {value:<Int16Array>this.texture};
      }
}