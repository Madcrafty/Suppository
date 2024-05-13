import { NodeEditor } from 'rete';
import { BaseAreaPlugin } from 'rete-area-plugin';
import { ExpectedScheme } from './types';
declare type Props<T> = {
    editor: NodeEditor<ExpectedScheme>;
    area: BaseAreaPlugin<ExpectedScheme, T>;
};
export declare function useValidator<T>(props: Props<T>): void;
export {};
//# sourceMappingURL=validation.d.ts.map