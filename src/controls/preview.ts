import { ClassicPreset } from 'rete';
import { globals } from '../../globals';
import * as utils from "../../misc/utils";
export class Preview extends ClassicPreset.Control {
    texture: null | Uint8ClampedArray = null;
    constructor() {
        super()
    }
    
    setTexture(texture: Int16Array) {
        this.texture = utils.int16touint8clamped(texture);
    }
}