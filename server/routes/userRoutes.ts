import { Router } from 'express';
import { getAllUsers } from '../controllers/user';

const userRouter = Router();

userRouter.get('/', async (_req, res) => {
    try {
        const allUsers = await getAllUsers();  
        res.json(allUsers);
    } catch {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



export default userRouter;
