


export const isObject = (error: unknown): error is object => {
    return typeof error === 'object' && error !== null;
};

export const isString = (text: unknown): text is string => {
    return (typeof text === 'string') || (text instanceof String);
};

export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every(item => isString(item));
}
