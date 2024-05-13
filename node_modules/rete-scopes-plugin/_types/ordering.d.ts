import { NodeEditor } from 'rete';
import { BaseArea, BaseAreaPlugin } from 'rete-area-plugin';
import { ExpectedScheme } from './types';
declare type Props<T> = {
    editor: NodeEditor<ExpectedScheme>;
    area: BaseAreaPlugin<ExpectedScheme, BaseArea<ExpectedScheme> | T>;
};
export declare function useOrdering<T>(props: Props<T>): void;
export {};
//# sourceMappingURL=ordering.d.ts.map