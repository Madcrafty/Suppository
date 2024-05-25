import { ClassicPreset } from "rete";


export class NumSocket extends ClassicPreset.Socket {
    constructor() {
        super("Number");
    }
    isCompatibleWith(socket: ClassicPreset.Socket) {
        return socket instanceof NumSocket;
    }
}

export class TexSocket extends ClassicPreset.Socket {
    constructor() {
        super("Texture");
    }
    isCompatibleWith(socket: ClassicPreset.Socket) {
        return socket instanceof TexSocket;
    }
}
