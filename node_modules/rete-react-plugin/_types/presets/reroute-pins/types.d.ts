import { ConnectionId } from 'rete';
import { Position, RenderSignal } from '../../types';
export declare type Pin = {
    id: string;
    position: Position;
    selected?: boolean;
};
export declare type PinData = {
    id: ConnectionId;
    pins: Pin[];
};
export declare type PinsRender = RenderSignal<'reroute-pins', {
    data: PinData;
}>;
//# sourceMappingURL=types.d.ts.map