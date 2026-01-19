import DeleteActionButton from '../ActionButtons/DeleteActionButton';
import EditActionButton from '../ActionButtons/EditActionButton';
import RestoreActionButton from '../ActionButtons/RestoreActionButton';

import type { ItemActions } from '../../../types';

type BookCardActionsProps = {
    bookId: number;
    isDeleted: boolean;
    allowedActions: ItemActions[];
    onEdit?: () => void;
    onDelete?: () => void;
    onRestore?: () => void;
};

const BookCardActions = (props: BookCardActionsProps) => {
    const { bookId, isDeleted, allowedActions, onEdit, onDelete, onRestore } = props;
    const filterDeleted = (action: ItemActions) => {
        if(isDeleted && (action === 'delete' || action === 'edit' )) return false;
        if(!isDeleted && action === 'restore') return false;
        return true;
    };

    const actions = allowedActions.filter(filterDeleted).map((action) => {
        switch(action) {
        case 'edit':
            return <EditActionButton key={`edit-book-${bookId}`} onClick={onEdit ?? (() => {})} tooltipTitle='Update Book' />;
        case 'delete':
            return <DeleteActionButton key={`delete-book-${bookId}`} onClick={onDelete ?? (() => {})} tooltipTitle='Delete Book' />;
        case 'restore':
            return <RestoreActionButton key={`restore-book-${bookId}`} onClick={onRestore ?? (() => {})} tooltipTitle='Restore Book' />;
        }
    });

    return (
        <>
            {actions}
        </>
    );
};

export default BookCardActions;