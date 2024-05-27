import * as React from 'react';
declare type RefUpdate = (ref: HTMLElement) => void;
declare type BaseProps = {
    init: RefUpdate;
    unmount: RefUpdate;
} & Record<string, unknown>;
/**
 * Component for rendering various elements embedded in the React.js component tree.
 */
export declare function RefComponent<Props extends BaseProps>({ init, unmount, ...props }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=ref-component.d.ts.map