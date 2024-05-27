import * as perlin from "./../../../misc/perlin";
import {globals} from "../../../globals";
import { TextureNode } from './TextureNode';

export class NoiseNode extends TextureNode {
    gridSize:number=40;
    perlin: null | number[][]=null;
    constructor() {
        super("Noise");     
    }
    makePerlin() {
        this.gridSize=20;
        var grid = perlin.create_grid(this.gridSize);
        this.perlin = perlin.create_map(globals.textureRes, grid, this.gridSize);
    }
    makeTexture() {
        this.texture=new Uint8ClampedArray(4 * globals.textureRes * globals.textureRes);
        this.makePerlin();
        for (var y = 0; y < globals.textureRes; y++) {
            for (var x = 0; x < globals.textureRes; x++){
                var cell = (x + y * globals.textureRes) * 4;
                var val = 255;
                if(this.perlin) {
                    val = this.perlin[x][y]*255;
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
}