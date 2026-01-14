import { useState } from 'react';

import { GRID_VIEW } from '../constants';
import type { ViewOptionsTypes } from '../types';


export const useViewOptions = () => {

    const [viewOption, setViewOption] = useState<ViewOptionsTypes>(GRID_VIEW);

    return {
        viewOption,
        setViewOption
    };
};
