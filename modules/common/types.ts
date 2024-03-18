export type NonEmptyArray<T> = [T, ...Array<T>];

export type ValuesOf<T> = T[keyof T];
