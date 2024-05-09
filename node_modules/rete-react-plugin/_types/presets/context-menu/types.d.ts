/// <reference types="react" />
import { RenderSignal } from '../../types';
export declare type Item = {
    label: string;
    key: string;
    handler(): void;
    subitems?: Item[];
};
export declare type ContextMenuRender = RenderSignal<'contextmenu', {
    items: Item[];
    onHide(): void;
    searchBar?: boolean;
}>;
export declare type ComponentType = React.ComponentType<React.HTMLProps<any>>;
export declare type Customize = {
    main?: () => ComponentType;
    item?: (item: Item) => ComponentType;
    search?: () => ComponentType;
    common?: () => ComponentType;
    subitems?: (Item: Item) => ComponentType;
};
//# sourceMappingURL=types.d.ts.map