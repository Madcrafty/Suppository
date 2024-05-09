/// <reference types="react" />
export declare function Root({ children, rendered }: {
    children: JSX.Element | null;
    rendered: () => void;
}): JSX.Element | null;
export declare function syncFlush(): {
    apply(f: () => void): void;
};
export declare function useRete<T extends {
    destroy(): void;
}>(create: (el: HTMLElement) => Promise<T>): readonly [import("react").MutableRefObject<null>, T | null];
//# sourceMappingURL=utils.d.ts.map