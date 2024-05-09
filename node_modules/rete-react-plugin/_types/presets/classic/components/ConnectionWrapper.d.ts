import * as React from 'react';
import { Position } from '../../../types';
export declare type ConnectionContextValue = {
    start: Position | null;
    end: Position | null;
    path: null | string;
};
export declare const ConnectionContext: React.Context<ConnectionContextValue>;
declare type PositionWatcher = (cb: (value: Position) => void) => (() => void);
declare type Props = {
    children: JSX.Element;
    start: Position | PositionWatcher;
    end: Position | PositionWatcher;
    path(start: Position, end: Position): Promise<null | string>;
};
export declare function ConnectionWrapper(props: Props): React.JSX.Element;
export declare function useConnection(): ConnectionContextValue;
export {};
//# sourceMappingURL=ConnectionWrapper.d.ts.map