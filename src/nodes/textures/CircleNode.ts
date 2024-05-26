
import {globals} from "../../../globals";
import { TextureNode } from './TextureNode';

export class CircleNode extends TextureNode {
    constructor() {
        super("Circle");     
    }
    makeTexture() {
        this.texture=new Uint8ClampedArray(4 * globals.textureRes * globals.textureRes);
        for (var y = 0; y < globals.textureRes; y++) {
            for (var x = 0; x < globals.textureRes; x++){

                var cell = (x + y * globals.textureRes) * 4;
                var xval = (x/globals.textureRes);
                var yval = 1-(y/globals.textureRes);
                var val = 0;
                if(((xval-0.5)*(xval-0.5))+((yval-0.5)*(yval-0.5)) < 0.1) {
                    val = 255;
                }
                this.texture[cell] = val;   
                this.texture[cell + 1] = val;   
                this.texture[cell + 2] = val;   
                this.texture[cell + 3] = 255;   
            }
        }
    }
}