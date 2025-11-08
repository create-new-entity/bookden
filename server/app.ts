import express from 'express';
import morgan from 'morgan';
import loginRouter, { loginBaseUrl } from './routes/loginRoutes';
import userRouter, { userBaseUrl } from './routes/userRoutes';
import { errorHandler } from './middlewares/errorhandler';
import testRouter, { testBaseUrl } from './routes/testRoutes';
import { isTestEnvironment } from './configs/config';
import cors from 'cors';
import avatarRouter, { avatarBaseUrl } from './routes/avatarRoutes';
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(userBaseUrl, userRouter);
app.use(loginBaseUrl, loginRouter);
app.use(avatarBaseUrl, avatarRouter);

if(isTestEnvironment()) {
    app.use(testBaseUrl, testRouter);
}

app.use(errorHandler);

export default app;