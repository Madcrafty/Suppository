import { ClassicPreset as Classic, GetSchemes, NodeEditor } from 'rete';
import { Preview } from '../../controls/preview';
import {globals} from "../../../globals";
import sockets from '../../rete/sockets';

export class TextureNode extends Classic.Node {
    width = 180;
    height = 270;
    texture: null | Int16Array = null;
    alpha: null | Int16Array = null;
    constructor(label: string) {
      super(label);
      this.addControl('preview', new Preview());
      this.addOutput('value', new Classic.Output(sockets.tex, 'Texture'));
      this.addInput('alpha', new Classic.Input(sockets.tex, "Alpha"));
      this.makeTexture();
      if(!this.texture) return;
      (this.controls['preview'] as Preview).setTexture(this.texture);
    }
    makeTexture() {
        //Assumes RGBA
        this.texture=new Int16Array(globals.textureSize);
        for (var y = 0; y < globals.textureRes; y++) {
          for (var x = 0; x < globals.textureRes; x++){
                var cell = (x + y * globals.textureRes) * 4;
                var val = 255;
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
      this.alpha = inputs['alpha'] && inputs['alpha'][0] instanceof Int16Array ? inputs['alpha'][0] : null;
      this.makeTexture();
      (this.controls['preview'] as Preview).setTexture(this.texture);
      return {value:<Int16Array>this.texture};
    }
  }