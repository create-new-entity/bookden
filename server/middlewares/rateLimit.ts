import rateLimit from 'express-rate-limit';
import { GLOBAL_RATE_LIMIT_MAX, LOGIN_RATE_LIMIT_MAX, ONE_MINUTE_IN_MILLISECONDS } from '../constants';


export const globalRateLimiter = rateLimit({
    windowMs: ONE_MINUTE_IN_MILLISECONDS,
    max: GLOBAL_RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
});

export const loginRateLimiter = rateLimit({
    windowMs: ONE_MINUTE_IN_MILLISECONDS,
    max: LOGIN_RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
});

