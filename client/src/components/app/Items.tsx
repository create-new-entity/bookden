import Grid from '@mui/material/Grid';

import { ITEMS_GRID_SIZES, LIST_VIEW, LIST_VIEW_GRID_SIZES } from '../../constants';
import type { ViewOptionsTypes } from '../../types';
import type { SxProps, Theme } from '@mui/material';

/*

    Note to future self:

    Why do we need the "itemProps"? What problem caused it, how does it fix it?



    Explanation:
    
    We use the same "Items" component below to render a bunch of items. Items can be
    books or users or potentially some other collection of contents in future.

    The way books are rendered is that book card can have a bunch of "actions" related to them.

    For example, if an admin is at the book management page, he may want to add, delete or update
    a book. Similarly, if a customer has searched some book from homepage he will end up at the
    book catalogs page, where he can add a book to wishlist or remove from wishlist.

    We want to use the same book card with different actions depending on the context.
    Context comes from the parent component ( "mode" in BookListLayout in this case ).

    So we write functions like getPublicBookActions and getAdminBookActions that return the actions based on the context.
    These are defined in bookActions file.

    Parent component can decide which function to use and pass it down. "itemProps" is through
    which we can pass down the getActions function to the book card, and the book card can call it to get the actions to render.

    This way we still use the same "Items" component and the same "BookCard" component.
    But "BookCard" will get different actions to render based on the context ( figured out by the parent component ).

*/


type ItemsProps<T, P extends object = Record<string, unknown>> = {
    items: T[];
    ItemComponent: React.ComponentType<{ item: T } & P>;
    itemProps? : P;
    getKey: (item: T) => React.Key;
    viewOption: ViewOptionsTypes;
    sx?: SxProps<Theme>;
};

const Items = <T, P extends object = Record<string, unknown>>(props: ItemsProps<T, P>) => {
    const {
        items, ItemComponent, itemProps,
        getKey, viewOption, sx
    } = props;

    const isListView = viewOption === LIST_VIEW;
    const gridSizes = isListView ? LIST_VIEW_GRID_SIZES : ITEMS_GRID_SIZES;
    return (
        <Grid container spacing={4} sx={{ width: '100%', ...sx }} justifyContent={'center'}>
            {
                items.map((item) => (
                    <Grid size={gridSizes} key={getKey(item)}>
                        <ItemComponent item={item} {...(itemProps ?? ({} as P))}/>
                    </Grid>
                ))  
            }
        </Grid>
    );
};

export default Items;