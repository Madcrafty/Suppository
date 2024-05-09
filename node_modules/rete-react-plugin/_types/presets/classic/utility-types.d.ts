/// <reference types="react" />
declare type UnionToIntersection<U> = (U extends never ? never : (arg: U) => never) extends (arg: infer I) => void ? I : never;
declare type StrictExcludeInner<T, U> = 0 extends (U extends T ? [T] extends [U] ? 0 : never : never) ? never : T;
declare type StrictExclude<T, U> = T extends unknown ? StrictExcludeInner<T, U> : never;
declare type UnionToTuple<T> = UnionToIntersection<T extends never ? never : (t: T) => T> extends (_: never) => infer W ? [...UnionToTuple<StrictExclude<T, W>>, W] : [];
declare type TupleToObject<T extends readonly any[], Rest extends object> = {
    [K in keyof T]: React.JSXElementConstructor<{
        data: T[K];
    } & Rest>;
}[number];
export declare type AcceptComponent<T, Rest extends object = {}> = TupleToObject<UnionToTuple<T>, Rest>;
export {};
//# sourceMappingURL=utility-types.d.ts.map