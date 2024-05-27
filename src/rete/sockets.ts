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
const col = new Socket('Color');
val.addCompatible(num);
val.addCompatible(tex);
val.addCompatible(col);
num.addCompatible(val);
tex.addCompatible(val);
col.addCompatible(val);

export default {
  val,
  num,
  tex,
  col
}