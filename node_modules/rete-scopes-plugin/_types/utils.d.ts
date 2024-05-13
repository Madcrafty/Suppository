import { BaseSchemes, NodeEditor, NodeId } from 'rete';
import { BaseAreaPlugin } from 'rete-area-plugin';
import { ExpectedScheme } from './types';
declare type Props<T> = {
    editor: NodeEditor<ExpectedScheme>;
    area: BaseAreaPlugin<ExpectedScheme, T>;
};
export declare function belongsTo<T>(nodeId: NodeId, ids: NodeId[], props: Props<T>): boolean | undefined;
export declare function hasSelectedParent<T>(nodeId: NodeId, props: Props<T>): boolean;
export declare type Translate = (nodeId: string, x: number, y: number) => Promise<void>;
/**
 * keep track of currently moving nodes (to prevent infinite loop)
 */
export declare function trackedTranslate<T>(props: Props<T>): {
    translate: Translate;
    isTranslating: (id: NodeId) => boolean;
};
export declare function watchClearing(editor: NodeEditor<BaseSchemes>): () => boolean;
export {};
//# sourceMappingURL=utils.d.ts.map