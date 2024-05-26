import { ClassicPreset } from "rete";

export class Socket extends ClassicPreset.Socket {
  compatible: Socket[] = [];
  addCompatible(socket: Socket) {
    this.compatible.push(socket);
  }
  isCompatibleWith(socket: Socket) {
    return this === socket || this.compatible.includes(socket);
  }
}

const val = new Socket('Value');
const num = new Socket('Number');
const tex = new Socket('Texture');
val.addCompatible(num);
val.addCompatible(tex);

num.addCompatible(val);
tex.addCompatible(val);

export default {
  val,
  num,
  tex
}