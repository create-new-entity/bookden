import Grid from '@mui/material/Grid';

import { ITEMS_GRID_SIZES, LIST_VIEW, LIST_VIEW_GRID_SIZES } from '../../constants';
import type { ViewOptionsTypes } from '../../types';
import type { SxProps, Theme } from '@mui/material';


type ItemsProps<T> = {
    items: T[];
    ItemComponent: React.ComponentType<{ item: T }>;
    getKey: (item: T) => React.Key;
    viewOption: ViewOptionsTypes;
    sx?: SxProps<Theme>;
};

const Items = <T,>({ items, ItemComponent, getKey, viewOption, sx }: ItemsProps<T>) => {
    const isListView = viewOption === LIST_VIEW;
    const gridSizes = isListView ? LIST_VIEW_GRID_SIZES : ITEMS_GRID_SIZES;
    return (
        <Grid container spacing={4} sx={{ width: '100%', ...sx }}>
            {
                items.map((item) => (
                    <Grid size={gridSizes} key={getKey(item)}>
                        <ItemComponent item={item}/>
                    </Grid>
                ))  
            }
        </Grid>
    );
};

export default Items;