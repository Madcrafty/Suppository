import { ClassicPreset as Classic, GetSchemes, NodeEditor } from 'rete';
import { Preview } from '../controls/preview';
import sockets from '../rete/sockets';
import { globals } from '../../globals';

export class ColorNode extends Classic.Node {
    width=180;
    height=380;
    texture: null | Int16Array = null;
    alpha: null | Int16Array = null;
    red=255;
    green=255;
    blue=255;
    constructor(change?: () => void) {
        super("Color");
        //this.addControl('colorpicker', new ColorPicker("white", change));
        this.addControl('preview', new Preview());
        this.addOutput('value', new Classic.Output(sockets.tex, 'texture'));
        this.addControl('red',new Classic.InputControl('number', { initial:this.red, change }));
        this.addControl('green',new Classic.InputControl('number', { initial:this.green, change }));
        this.addControl('blue',new Classic.InputControl('number', { initial:this.blue, change }));
        this.addInput('alpha', new Classic.Input(sockets.tex, "alpha"));
        this.makeTexture();
        if(!this.texture) return;
        (this.controls['preview'] as Preview).setTexture(this.texture);
    }
    makeTexture() {
        //Assumes RGBA
        this.texture=new Int16Array(4 * globals.textureRes * globals.textureRes);
        for (var y = 0; y < globals.textureRes; y++) {
          for (var x = 0; x < globals.textureRes; x++){
                var cell = (x + y * globals.textureRes) * 4;
                if(this.alpha) {
                    var alpha = (this.alpha[cell] + this.alpha[cell+1] + this.alpha[cell+2])/3;
                  } else {
                    var alpha = 255;
                  }
                this.texture[cell] = this.red;   
                this.texture[cell + 1] = this.green;   
                this.texture[cell + 2] = this.blue;   
                this.texture[cell + 3] = alpha;
            }
        }
    }
    data (inputs: any) {
        this.alpha = inputs['alpha'] && inputs['alpha'][0] instanceof Int16Array ? inputs['alpha'][0] : null;
        const red = (this.controls['red'] as Classic.InputControl<'number'>).value;
        const green = (this.controls['green'] as Classic.InputControl<'number'>).value;
        const blue = (this.controls['blue'] as Classic.InputControl<'number'>).value;
        this.red = (red!=null) ? red : this.red;
        this.green = (green!=null) ? green : this.green;
        this.blue = (blue!=null) ? blue : this.blue;
        this.makeTexture();
        if(!this.texture) return {};
      (this.controls['preview'] as Preview).setTexture(this.texture);
      return {value:this.texture};
    }
}