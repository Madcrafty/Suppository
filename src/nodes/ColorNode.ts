import { ClassicPreset as Classic, GetSchemes, NodeEditor } from 'rete';
import { ColorPicker } from '../controls/colorpicker';
import sockets from '../rete/sockets';

export class ColorNode extends Classic.Node {
    width=180;
    height=360;
    texture = new Uint8ClampedArray();
    constructor(change?: () => void) {
        super("Color");
        this.addControl('colorpicker', new ColorPicker("white", change));
        this.addOutput('value', new Classic.Output(sockets.col, 'Color'));
    }
    data() {
        if(!this.texture) return {};

        const color = (this.controls['colorpicker'] as ColorPicker).value;
        return {value:color}
    }
}