import { Router } from 'express';
import { getAllUsers } from '../controllers/user';

const userRouter = Router();

userRouter.get('/', async (req, res) => {
    try {
        const allUsers = await getAllUsers();  
        res.json(allUsers);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default userRouter;
