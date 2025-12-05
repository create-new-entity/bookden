import { useState } from 'react';
import { GRID_VIEW } from '../constants';
import type { ViewOptionsTypes } from '../types';


const useViewOptions = () => {

    const [viewOption, setViewOption] = useState<ViewOptionsTypes>(GRID_VIEW);

    return {
        viewOption,
        setViewOption
    };
};

export default useViewOptions;