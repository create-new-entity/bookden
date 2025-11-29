import type { AxiosError, AxiosResponse } from 'axios';

export type AxiosErrorResponse = AxiosError<{ message: string, name: string, response: AxiosResponse }>;

export type SortOrder = 'asc' | 'desc';