import { ClassicPreset } from 'rete';

export class ColorPicker extends ClassicPreset.Control {
    constructor(public value: string, public change?: () => void) {
        super()
    }
    setValue(value: string) {
        this.value = value
        if(!this.change) return;
        this.change()
    }
}