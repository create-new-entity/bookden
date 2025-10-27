import express from 'express';
import morgan from 'morgan';
import loginRouter, { loginBaseUrl } from './routes/loginRoutes';
import userRouter, { userBaseUrl } from './routes/userRoutes';
import errorHandler from './middlewares/errorhandler';
import testRouter, { testBaseUrl } from './routes/testRoutes';
import { isTestEnvironment } from './configs/config';

const app = express();

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(userBaseUrl, userRouter);
app.use(loginBaseUrl, loginRouter);

if(isTestEnvironment()) {
    app.use(testBaseUrl, testRouter);
}

app.use(errorHandler);

export default app;