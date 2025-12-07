
import { Router } from 'express';

import { asyncHandler, tokenExtractor } from '../middlewares';
import {
    getAllBooksController,
    getBookController,
    createBookController,
    updateBookController,
    deleteBookController,
} from '../controllers';


export const bookBaseUrl = '/api/books';

const bookRouter = Router();

bookRouter.get('/', tokenExtractor, asyncHandler(getAllBooksController));
bookRouter.get('/:id', tokenExtractor, asyncHandler(getBookController));
bookRouter.post('/', tokenExtractor, asyncHandler(createBookController));
bookRouter.patch('/:id', tokenExtractor, asyncHandler(updateBookController));
bookRouter.delete('/:id', tokenExtractor, asyncHandler(deleteBookController));


export default bookRouter;
