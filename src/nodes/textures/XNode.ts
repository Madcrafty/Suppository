import {globals} from "../../../globals";
import { TextureNode } from './TextureNode';

export class XNode extends TextureNode {
    constructor() {
      super("X-Coords");     
    }
    makeTexture() {
        this.texture=new Int16Array(4 * globals.textureRes * globals.textureRes);
        for (var y = 0; y < globals.textureRes; y++) {
            for (var x = 0; x < globals.textureRes; x++){
                var cell = (x + y * globals.textureRes) * 4;
                var val = (x/globals.textureRes)*255;
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
  }