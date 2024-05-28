import { globals } from "../globals";

export function int16touint8clamped(int16: Int16Array) {
    var uint8 = new Uint8ClampedArray(globals.textureSize);
    for(let i=0; i<globals.textureSize;i++) {
        uint8[i]=Math.max(0, Math.min(255, Math.abs(int16[i])));
    }
    return uint8;
}

export function int16touint8(int16: Int16Array) {
    var uint8 = new Uint8Array(globals.textureSize);
    for(let i=0; i<globals.textureSize;i++) {
        uint8[i]=Math.max(0, Math.min(255, Math.abs(int16[i])));
    }
    return uint8;
}