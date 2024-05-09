import * as ReactDOM from 'react-dom';
export declare type Renderer = {
    mount: ReactDOM.Renderer;
    unmount: (container: HTMLElement) => void;
};
declare type CreateRoot = (container: Element | DocumentFragment) => any;
export declare function getRenderer(props?: {
    createRoot?: CreateRoot;
}): Renderer;
export {};
//# sourceMappingURL=renderer.d.ts.map