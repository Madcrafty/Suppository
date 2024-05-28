import * as perlin from "../../../misc/perlin";
import {globals} from "../../../globals";
import { ClassicPreset as Classic }  from "rete";
import { Preview } from "../../controls/preview";
import sockets from "../../rete/sockets";

export class LayeredNoiseNode extends Classic.Node {
    gridSize:number=40;
    perl: number[][]=[];
    texture: null | Int16Array = null;
    alpha: null | Int16Array = null;
    constructor() {
      super("Layered Noise");
      this.makePerlin();
      this.addControl('preview', new Preview());
      this.addOutput('value', new Classic.Output(sockets.tex, 'Texture'));
      this.addInput('alpha', new Classic.Input(sockets.tex, "Alpha"));
      this.makeTexture();
      if(!this.texture) return;
      (this.controls['preview'] as Preview).setTexture(this.texture);
    }
    makePerlin() {
        this.gridSize=5;
        var grid = perlin.create_grid(this.gridSize);
        this.perl = perlin.create_layered_map(grid, this.gridSize, 4, 0.5, 2);
    }
    makeTexture() {
        this.texture=new Int16Array(4 * globals.textureRes * globals.textureRes);
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
        this.alpha = inputs['alpha'] && inputs['alpha'][0] instanceof Int16Array ? inputs['alpha'][0] : null;
        this.makeTexture();
        (this.controls['preview'] as Preview).setTexture(this.texture);
        return {value:this.texture};
      }
}