import { ClassicPreset as Classic, GetSchemes, NodeEditor } from 'rete';
import { Preview } from '../../controls/preview';
import {globals} from "../../../globals";
import sockets from '../../rete/sockets';

export class TextureNode extends Classic.Node {
    width = 180;
    height = 250;
    texture = new Uint8ClampedArray();
    constructor(label: string) {
      super(label);
      this.addControl('preview', new Preview());
      this.addOutput('value', new Classic.Output(sockets.tex, 'Texture'));
      this.makeTexture();
      if(!this.texture) return;
      (this.controls['preview'] as Preview).setTexture(this.texture);
    }
    makeTexture() {
        //Assumes RGBA
        this.texture=new Uint8ClampedArray(4 * globals.textureRes * globals.textureRes);
        for (var y = 0; y < globals.textureRes; y++) {
          for (var x = 0; x < globals.textureRes; x++){
                var cell = (x + y * globals.textureRes) * 4;
                var val = 255;
                this.texture[cell] = val;   
                this.texture[cell + 1] = val;   
                this.texture[cell + 2] = val;   
                this.texture[cell + 3] = 255;   
            }
        }
    }
    data () {
      if(!this.texture) return {};
      (this.controls['preview'] as Preview).setTexture(this.texture);
      return {value:<Uint8ClampedArray>this.texture};
    }
  }