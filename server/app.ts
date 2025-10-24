import express from 'express';
import userRouter from './routes/userRoutes';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use('/api/users', userRouter);

export default app;