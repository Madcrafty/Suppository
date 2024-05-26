import { ClassicPreset as Classic, GetSchemes, NodeEditor } from 'rete';
import { Preview } from '../controls/preview';
import {globals} from "../../globals";
import { TexSocket } from './sockets';

export class TextureNode extends Classic.Node {
    width = 180;
    height = 300;
    texture: null | Uint8ClampedArray = null;
    constructor(label: string) {
      super(label);
      this.addOutput('value', new Classic.Output(new TexSocket, 'Texture'));
      this.addControl('preview', new Preview());
      this.makeTexture();
      if(!this.texture) return;
      (this.controls['preview'] as Preview).setTexture(this.texture);
    }
    makeTexture() {
        //Assumes RGBA
        this.texture=new Uint8ClampedArray(4 * globals.textureRes * globals.textureRes);
        for (var x = 0; x < globals.textureRes; x++) {                  
            for (var y = 0; y < globals.textureRes; y++) {
                var cell = (x + y * globals.textureRes) * 4;
                this.texture[cell] = 255;   
                this.texture[cell + 1] = 255;   
                this.texture[cell + 2] = 255;   
                this.texture[cell + 3] = 255;   
            }
        }
    }
    data () {
      if(!this.texture) return {};
      (this.controls['preview'] as Preview).setTexture(this.texture);
      return {};
    }
  }