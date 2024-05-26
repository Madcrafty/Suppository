import { ClassicPreset as Classic, GetSchemes, NodeEditor } from 'rete';
import { Preview } from '../controls/preview';
import {globals} from "../../globals";
import { TextureNode } from './TextureNode';
import { TexSocket } from './sockets';

export class XNode extends TextureNode {
    constructor() {
      super("X-Coords");     
    }
    makeTexture() {
        this.texture=new Uint8ClampedArray(4 * globals.textureRes * globals.textureRes);
        for (var x = 0; x < globals.textureRes; x++) {                  
            for (var y = 0; y < globals.textureRes; y++) {
                var cell = (x + y * globals.textureRes) * 4;
                var val = (x/globals.textureRes)*255;
                this.texture[cell] = val;   
                this.texture[cell + 1] = val;   
                this.texture[cell + 2] = val;   
                this.texture[cell + 3] = 255;   
            }
        }
    }
  }