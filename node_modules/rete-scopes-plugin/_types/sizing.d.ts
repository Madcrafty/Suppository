import { NodeEditor } from 'rete';
import { BaseAreaPlugin } from 'rete-area-plugin';
import { AgentParams } from './agents/types';
import { ExpectedScheme } from './types';
declare type Props<T> = {
    editor: NodeEditor<ExpectedScheme>;
    area: BaseAreaPlugin<ExpectedScheme, T>;
};
export declare function getNodesBoundingBox<T>(nodes: ExpectedScheme['Node'][], { area }: Props<T>): {
    top: number;
    left: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
};
declare type Size = {
    width: number;
    height: number;
};
export declare function updateNodeSizes<T>(node: ExpectedScheme['Node'], size: Size, { area }: Props<T>): void;
export declare function resizeParent<T>(parent: ExpectedScheme['Node'], agentParams: AgentParams, props: Props<T>): Promise<void>;
export {};
//# sourceMappingURL=sizing.d.ts.map