import express from 'express';
import morgan from 'morgan';
import loginRouter from './routes/loginRoutes';
import userRouter from './routes/userRoutes';

const app = express();

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

export default app;