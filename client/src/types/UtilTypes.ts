import type { AxiosError, AxiosResponse } from 'axios';
import type { VIEW_OPTIONS } from '../constants';

export type AxiosErrorResponse = AxiosError<{ message: string, name: string, response: AxiosResponse }>;

export type SortOrder = 'asc' | 'desc';

export type ViewOptionsTypes = typeof VIEW_OPTIONS[number];

export const isObject = (error: unknown): error is object => {
    return typeof error === 'object' && error !== null;
};

export type MultiSelectOption<V extends string | number> = {
    value: V;
    label: string;
};

export type SingleSelectOption<V extends string | number> = {
    value: V;
    label: string;
};
  

export type ItemActions = 'edit' | 'delete' | 'restore';