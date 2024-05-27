import * as perlin from "./../../../misc/perlin";
import {globals} from "../../../globals";
import { TextureNode } from './TextureNode';
import { ClassicPreset as Classic }  from "rete";
import { Preview } from "../../controls/preview";
import sockets from "../../rete/sockets";

export class NoiseNode extends Classic.Node {
    gridSize:number=40;
    perl: number[][]=[];
    width = 180;
    height = 270;
    texture: null | Uint8ClampedArray = null;
    alpha: null | Uint8ClampedArray = null;
    constructor() {
      super("Noise");
      this.makePerlin();
      this.addControl('preview', new Preview());
      this.addOutput('value', new Classic.Output(sockets.tex, 'Texture'));
      this.addInput('alpha', new Classic.Input(sockets.tex, "alpha"));
      this.makeTexture();
      if(!this.texture) return;
      (this.controls['preview'] as Preview).setTexture(this.texture);
    }
    makePerlin() {
        this.gridSize=20;
        var grid = perlin.create_grid(this.gridSize);
        this.perl = perlin.create_map(grid, this.gridSize);
    }
    makeTexture() {
        this.texture=new Uint8ClampedArray(4 * globals.textureRes * globals.textureRes);
        for (var y = 0; y < globals.textureRes; y++) {
            for (var x = 0; x < globals.textureRes; x++){
                var cell = (x + y * globals.textureRes) * 4;
                var val = 255;
                if(this.perl) {
                    val = this.perl[x][y]*255;
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
        this.alpha = inputs['alpha'] && inputs['alpha'][0] instanceof Uint8ClampedArray ? inputs['alpha'][0] : null;
        this.makeTexture();
        (this.controls['preview'] as Preview).setTexture(this.texture);
        return {value:<Uint8ClampedArray>this.texture};
      }
}