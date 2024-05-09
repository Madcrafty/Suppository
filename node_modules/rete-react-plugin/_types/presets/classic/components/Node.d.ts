import * as React from 'react';
import { ClassicScheme, RenderEmit } from '../types';
declare type NodeExtraData = {
    width?: number;
    height?: number;
};
export declare const NodeStyles: import("styled-components").StyledComponent<"div", any, NodeExtraData & {
    selected: boolean;
    styles?: ((props: any) => any) | undefined;
}, never>;
declare type Props<S extends ClassicScheme> = {
    data: S['Node'] & NodeExtraData;
    styles?: () => any;
    emit: RenderEmit<S>;
};
export declare type NodeComponent<Scheme extends ClassicScheme> = (props: Props<Scheme>) => JSX.Element;
export declare function Node<Scheme extends ClassicScheme>(props: Props<Scheme>): React.JSX.Element;
export {};
//# sourceMappingURL=Node.d.ts.map