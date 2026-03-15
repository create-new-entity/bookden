import DeleteActionIcon from '../components/app/ActionIcons/DeleteActionIcon';
import EditActionIcon from '../components/app/ActionIcons/EditActionIcon';
import RestoreActionButton from '../components/app/ActionIcons/RestoreActionButton';
import AddToWishlistAction from '../components/app/ActionIcons/AddToWishlistAction';
import RemoveFromWishlistAction from '../components/app/ActionIcons/RemoveFromWishlistAction';
import type { Book, BookAction } from '../types';

type BookActions = {
    onEdit: (bookId: number) => void;
    onDelete: (bookId: number) => void;
    onRestore: (bookId: number) => void;

    onAddToWishlist: (bookId: number) => void;
    onRemoveFromWishlist: (bookId: number) => void;
};

export type AdminBookActionHandlers = Pick<BookActions, 'onEdit' | 'onDelete' | 'onRestore'>;
export type PublicBookActionHandlers = Pick<BookActions, 'onAddToWishlist' | 'onRemoveFromWishlist'>;

// #region Admin ( superadmin and admin ) level book actions

const createEditBookAction = (
    book: Book,
    onEdit: BookActions['onEdit']
): BookAction => {
    return {
        id: `edit-book-${book.bookId}`,
        onClick: () => onEdit(book.bookId),
        toolTipTitle: 'Update Book',
        IconComponent: EditActionIcon
    };
};

const createDeleteBookAction = (
    book: Book,
    onDelete: BookActions['onDelete']
): BookAction => {
    return {
        id: `delete-book-${book.bookId}`,
        onClick: () => onDelete(book.bookId),
        toolTipTitle: 'Delete Book',
        IconComponent: DeleteActionIcon
    };
};

const createRestoreBookAction = (
    book: Book,
    onRestore: BookActions['onRestore']
): BookAction => {
    return {
        id: 'restore',
        onClick: () => onRestore(book.bookId),
        toolTipTitle: 'Restore Book',
        IconComponent: RestoreActionButton
    };
};


export const getAdminBookActions = (
    book: Book,
    handlers: {
        onEdit: BookActions['onEdit'];
        onDelete: BookActions['onDelete'];
        onRestore: BookActions['onRestore'];
    }
): BookAction[] => {
    return [
        createEditBookAction(book, handlers.onEdit),
        ...(book.deletedAt === null ? [createDeleteBookAction(book, handlers.onDelete)] : [createRestoreBookAction(book, handlers.onRestore)])
    ];
};

// #endregion



// #region Public level book actions. Meant for customer users, not meant for admin users.

const createAddToWishlistAction = (
    book: Book,
    onAddToWishlist: BookActions['onAddToWishlist']
): BookAction => {
    return {
        id: `add-to-wishlist-${book.bookId}`,
        onClick: () => onAddToWishlist(book.bookId),
        toolTipTitle: 'Add to Wishlist',
        IconComponent: AddToWishlistAction
    };
};

const createRemoveFromWishlistAction = (
    book: Book,
    onRemoveFromWishlist: BookActions['onRemoveFromWishlist']
): BookAction => {
    return {
        id: `remove-from-wishlist-${book.bookId}`,
        onClick: () => onRemoveFromWishlist(book.bookId),
        toolTipTitle: 'Remove from Wishlist',
        IconComponent: RemoveFromWishlistAction
    };
};

export const getPublicBookActions = (
    book: Book,
    handlers: {
        onAddToWishlist: BookActions['onAddToWishlist'];
        onRemoveFromWishlist: BookActions['onRemoveFromWishlist'];
    }
): BookAction[] => {
    return [
        ...(book.isWishlisted ? [ createRemoveFromWishlistAction(book, handlers.onRemoveFromWishlist) ] : [ createAddToWishlistAction(book, handlers.onAddToWishlist) ])
    ];
};

// #endregion