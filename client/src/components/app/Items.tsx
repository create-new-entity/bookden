import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';

import { ITEMS_GRID_SIZES, LIST_VIEW, LIST_VIEW_GRID_SIZES } from '../../constants';
import type { ViewOptionsTypes } from '../../types';


type ItemsProps<T> = {
    items: T[];
    ItemComponent: React.ComponentType<{ item: T }>;
    getKey: (item: T) => React.Key;
    viewOption: ViewOptionsTypes;
};

const Items = <T,>({ items, ItemComponent, getKey, viewOption }: ItemsProps<T>) => {
    const isListView = viewOption === LIST_VIEW;
    const gridSizes = isListView ? LIST_VIEW_GRID_SIZES : ITEMS_GRID_SIZES;
    return (
        <Grid container spacing={2}>
            {
                items.map((item) => (
                    <Grid size={gridSizes} key={getKey(item)}>
                        <Box>
                            <ItemComponent item={item} />
                        </Box>
                    </Grid>
                ))  
            }
        </Grid>
    );
};

export default Items;