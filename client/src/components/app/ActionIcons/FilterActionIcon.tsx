import FilterAltIcon from '@mui/icons-material/FilterAlt';

import ActionIcon from './ActionIcon';

type FilterActionButtonProps = {
    onClick: () => void;
    tooltipTitle: string;
};

const FilterActionIcon = (props: FilterActionButtonProps) => {
    const { onClick, tooltipTitle } = props;
    
    return (
        <ActionIcon
            icon={<FilterAltIcon />}
            onClick={onClick}
            tooltipTitle={tooltipTitle}
        />
    );
};

export default FilterActionIcon;