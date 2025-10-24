import express from 'express';
import morgan from 'morgan';
import userRouter from './routes/userRoutes';
import loginRouter from './routes/loginRoutes';
import errorHandler from './middlewares/errorhandler';

const app = express();

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use(errorHandler);

export default app;