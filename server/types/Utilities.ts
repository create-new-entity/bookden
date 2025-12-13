

/* 
    https://chatgpt.com/share/68fca85e-06a0-8012-84c8-de0b0f5cdf9c

    Utitlity type to define the snake_case version of a given string literal type S.

    Example: userName -> user_name

    type Test = SnakeCase<'userType'>; // "user_type"
*/
type SnakeCase<S extends string> = 
    S extends `${infer T}${infer U}`
        ? T extends Capitalize<T>
            ? `_${Lowercase<T>}${SnakeCase<U>}`
            : `${T}${SnakeCase<U>}`
        : S; // <--- base case

export type SnakeCaseDeepObject<T> = {
    [K in keyof T as SnakeCase<string & K>]: T[K];
};


/* 
    To understand CamelCase, CamelCaseDeepArray and CamelCaseDeep better
    check the following chat:
    https://chatgpt.com/share/6910bb5f-d038-8012-a6da-af9f577d2a0d
*/

type CamelCase<S extends string> =
  S extends `${infer Head}_${infer Tail}`
    ? `${Head}${Capitalize<CamelCase<Tail>>}`
    : S;

type CamelCaseDeepArray<T extends readonly unknown[]> = T extends [infer First, ...infer Rest]
  ? [CamelCaseDeep<First>, ...CamelCaseDeepArray<Rest>]
  : T extends (infer U)[]
    ? CamelCaseDeep<U>[]
    : [];

export type CamelCaseDeep<T> = T extends readonly unknown[]
  ? CamelCaseDeepArray<T>
  : T extends object
    ? { [K in keyof T as K extends string ? CamelCase<K> : K]: CamelCaseDeep<T[K]> }
    : T;


