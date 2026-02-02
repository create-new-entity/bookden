import { UserTypes } from './User';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import QueryString from 'qs';


export interface AuthenticatedRequest<
  ReqQuery = QueryString.ParsedQs,
  ReqBody = Request['body']
> extends Request<ParamsDictionary, unknown, ReqBody, ReqQuery> {  // Express's request type is this: Request<Params, ResBody, ReqBody, ReqQuery>. ResBody is "any" by Express itself. unknown is assignable to any.
  user?: JWTSignPayload;
}



export type JWTSignPayload = {
    userId: number;
    username: string;
    userType: UserTypes;
    tokenVersion: number;
};