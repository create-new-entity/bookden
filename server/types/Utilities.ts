

/* 
    https://chatgpt.com/share/68fca85e-06a0-8012-84c8-de0b0f5cdf9c

    Utitlity type to define the snake_case version of a given string literal type S.

    Example: userName -> user_name

    type Test = SnakeCase<'userType'>; // "user_type"
    type Test2 = SnakeCase<'isActive'>; // "is_active"
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

export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
