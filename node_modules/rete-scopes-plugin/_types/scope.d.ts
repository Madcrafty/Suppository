import { NodeEditor, NodeId } from 'rete';
import { BaseAreaPlugin } from 'rete-area-plugin';
import { AgentParams } from './agents/types';
import { ExpectedScheme, Position } from './types';
declare type Props<T> = {
    editor: NodeEditor<ExpectedScheme>;
    area: BaseAreaPlugin<ExpectedScheme, T>;
};
export declare function reassignParent<T>(ids: NodeId[], pointer: {
    x: number;
    y: number;
}, agentParams: AgentParams, props: Props<T>): Promise<void>;
export declare function translateChildren<T>(id: NodeId, { position, previous }: {
    position: Position;
    previous: Position;
}, props: Props<T>): Promise<void>;
export {};
//# sourceMappingURL=scope.d.ts.map