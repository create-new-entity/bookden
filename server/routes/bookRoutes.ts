
import { Router } from 'express';

import {
    asyncHandler, enforceAuthentication,
    tokenExtractor, uploadImage,
    validTokenIsNotRequired
} from '../middlewares';
import {
    getAllBooksController, getBookController, createBookController,
    updateBookController, deleteBookController, getBookCoverController,
    updateBookCoverController, deleteBookCoverController, getTagsController,
    getBooksPriceRangeController, restoreBookController, addBookToWishlistController,
    removeBookFromWishlistController, getWishlistedBooksController,
    getHomePageBooksController
} from '../controllers';

export const bookBaseUrl = '/api/books';

const bookRouter = Router();

bookRouter.get('/tags', asyncHandler(getTagsController));
bookRouter.get('/filters/meta', asyncHandler(getBooksPriceRangeController));

bookRouter.get('/homepage-books', asyncHandler(getHomePageBooksController));

bookRouter.get('/:id/cover/public', validTokenIsNotRequired, tokenExtractor, asyncHandler(getBookCoverController));
bookRouter.get('/:id/cover/admin', tokenExtractor, enforceAuthentication, asyncHandler(getBookCoverController));
bookRouter.put('/:id/cover', tokenExtractor, enforceAuthentication, uploadImage.single('coverImage'), asyncHandler(updateBookCoverController));
bookRouter.delete('/:id/cover', tokenExtractor, enforceAuthentication, asyncHandler(deleteBookCoverController));

bookRouter.post('/:id/wishlist', tokenExtractor, enforceAuthentication, asyncHandler(addBookToWishlistController));
bookRouter.delete('/:id/wishlist', tokenExtractor, enforceAuthentication, asyncHandler(removeBookFromWishlistController));
bookRouter.get('/wishlist', tokenExtractor, enforceAuthentication, asyncHandler(getWishlistedBooksController));


bookRouter.get('/admin', tokenExtractor, enforceAuthentication, asyncHandler(getAllBooksController));
bookRouter.get('/public', validTokenIsNotRequired, tokenExtractor, asyncHandler(getAllBooksController));


bookRouter.get('/:id/public', validTokenIsNotRequired, tokenExtractor, asyncHandler(getBookController));
bookRouter.get('/:id/admin', tokenExtractor, asyncHandler(getBookController));
bookRouter.patch('/:id', tokenExtractor, enforceAuthentication, asyncHandler(updateBookController));
bookRouter.delete('/:id', tokenExtractor, enforceAuthentication, asyncHandler(deleteBookController));
bookRouter.put('/:id/restore', tokenExtractor, enforceAuthentication, asyncHandler(restoreBookController));

bookRouter.post('/', tokenExtractor, enforceAuthentication, uploadImage.single('coverImage'), asyncHandler(createBookController));






export default bookRouter;
