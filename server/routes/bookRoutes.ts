
import { Router } from 'express';

import { asyncHandler, tokenExtractor, uploadImage } from '../middlewares';
import {
    getAllBooksController,
    getBookController,
    createBookController,
    updateBookController,
    deleteBookController,
    getBookCoverController,
    updateBookCoverController,
    deleteBookCoverController,
    getTagsController,
    getBooksPriceRangeController
} from '../controllers';

export const bookBaseUrl = '/api/books';

const bookRouter = Router();

bookRouter.get('/tags', asyncHandler(getTagsController));
bookRouter.get('/filters/meta', asyncHandler(getBooksPriceRangeController));


bookRouter.get('/:id/cover', tokenExtractor, asyncHandler(getBookCoverController));
bookRouter.put('/:id/cover', tokenExtractor, uploadImage.single('coverImage'), asyncHandler(updateBookCoverController));
bookRouter.delete('/:id/cover', tokenExtractor, asyncHandler(deleteBookCoverController));

bookRouter.get('/:id', tokenExtractor, asyncHandler(getBookController));
bookRouter.patch('/:id', tokenExtractor, asyncHandler(updateBookController));
bookRouter.delete('/:id', tokenExtractor, asyncHandler(deleteBookController));

bookRouter.post('/', tokenExtractor, uploadImage.single('coverImage'), asyncHandler(createBookController));
bookRouter.get('/', tokenExtractor, asyncHandler(getAllBooksController));


export default bookRouter;
