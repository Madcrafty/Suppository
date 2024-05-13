import { ConnectionBase, GetSchemes, NodeBase, NodeId } from 'rete';
export declare type Padding = {
    top: number;
    left: number;
    right: number;
    bottom: number;
};
export declare type NodeScheme = NodeBase & {
    width: number;
    height: number;
    parent?: NodeId;
    selected?: boolean;
};
export declare type ExpectedScheme = GetSchemes<NodeScheme, ConnectionBase>;
export declare type Position = {
    x: number;
    y: number;
};
export declare type Size = {
    width: number;
    height: number;
};
//# sourceMappingURL=types.d.ts.map