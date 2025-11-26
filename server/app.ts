import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { isTestEnvironment } from './configs';
import {
    loginBaseUrl,
    loginRouter,
    userBaseUrl,
    userRouter,
    testBaseUrl,
    testRouter,
    avatarBaseUrl,
    avatarRouter,
    healthBaseUrl,
    healthRouter,
} from './routes';
import { errorHandler } from './middlewares';
import { globalRateLimiter, loginRateLimiter } from './middlewares/rateLimit';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(healthBaseUrl, healthRouter);
app.use(globalRateLimiter);

app.use(userBaseUrl, userRouter);
app.use(loginBaseUrl, loginRateLimiter, loginRouter);
app.use(avatarBaseUrl, avatarRouter);


if(isTestEnvironment()) {
    app.use(testBaseUrl, testRouter);
}

app.use(errorHandler);

export default app;