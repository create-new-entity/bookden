import express from 'express';
import morgan from 'morgan';
import loginRouter, { loginBaseUrl } from './routes/loginRoutes';
import userRouter, { userBaseUrl } from './routes/userRoutes';
import errorHandler from './middlewares/errorhandler';

const app = express();

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(userBaseUrl, userRouter);
app.use(loginBaseUrl, loginRouter);
app.use(errorHandler);

export default app;