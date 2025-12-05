import { IconButton, Stack, useTheme, type SxProps, type Theme } from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GridViewIcon from '@mui/icons-material/GridView';

import { BORDER_RADIUS, DEFAULT_GAP, GRID_VIEW, LIST_VIEW } from '../../constants';
import type { ViewOptionsTypes } from '../../types';


type Styles = {
    rootStack: SxProps<Theme>;
};

const getStyles = (theme: Theme): Styles => {
    return {
        rootStack: {
            alignSelf: 'stretch',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.palette.primary.light
        }
    };
};

type ViewOptionsProps = {
    viewOption: ViewOptionsTypes;
    setViewOption: React.Dispatch<React.SetStateAction<ViewOptionsTypes>>;
};

const ViewOptions = ({ viewOption, setViewOption }: ViewOptionsProps) => {
    const theme = useTheme();
    const styles = getStyles(theme);
    return (
        <Stack sx={styles.rootStack} direction={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={`${DEFAULT_GAP}px`}>
            <IconButton onClick={() => setViewOption(LIST_VIEW)} disabled={viewOption === LIST_VIEW}>
                <FormatListBulletedIcon />
            </IconButton>
            <IconButton onClick={() => setViewOption(GRID_VIEW)} disabled={viewOption === GRID_VIEW}>
                <GridViewIcon />
            </IconButton>
        </Stack>
    );
};

export default ViewOptions;