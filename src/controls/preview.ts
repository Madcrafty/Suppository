import { ClassicPreset } from 'rete';

export class Preview extends ClassicPreset.Control {
    texture: null | Uint8ClampedArray = null;
    constructor() {
        super()
    }
    
    setTexture(texture: Uint8ClampedArray) {
        this.texture = texture;
    }
}