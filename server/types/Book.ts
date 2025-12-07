import z from 'zod';
import { CamelCaseKeys } from 'camelcase-keys';

import { BookTypeAlias } from '../typeAliases';
import { CreateBookPayloadSchema, UpdateBookPayloadSchema } from '../validation';


export type BookDBRow = z.infer<typeof BookTypeAlias>;
export type Book = CamelCaseKeys<BookDBRow>;
export type UpdateBookPayload = z.infer<typeof UpdateBookPayloadSchema>;
export type CreateBookPayload = z.infer<typeof CreateBookPayloadSchema>;

