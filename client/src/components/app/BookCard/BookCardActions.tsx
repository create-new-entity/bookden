import DeleteActionIcon from '../ActionIcons/DeleteActionIcon';
import EditActionIcon from '../ActionIcons/EditActionIcon';
import RestoreActionButton from '../ActionIcons/RestoreActionButton';

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
            return <EditActionIcon key={`edit-book-${bookId}`} onClick={onEdit ?? (() => {})} tooltipTitle='Update Book' />;
        case 'delete':
            return <DeleteActionIcon key={`delete-book-${bookId}`} onClick={onDelete ?? (() => {})} tooltipTitle='Delete Book' />;
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