import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { IconButton, useTheme, type SxProps, type Theme } from '@mui/material';
import { Stack, Tooltip } from '@mui/material';

type View = 'grid' | 'list';

export type ViewSelectorProps = {
    selectedView: View;
    onViewChange: (view: View) => void;
};

type Styles = {
    gridIconButton: SxProps<Theme>;
    listIconButton: SxProps<Theme>;
};

const getStyles = (theme: Theme, selectedView: View): Styles => {
    return {
        gridIconButton: {
            backgroundColor: selectedView === 'grid' ? theme.palette.action.selected : 'transparent',
        },
        listIconButton: {
            backgroundColor: selectedView === 'list' ? theme.palette.action.selected : 'transparent',
        },
    };
};




const ViewSelector = ({ selectedView, onViewChange }: ViewSelectorProps) => {
    const theme = useTheme();
    const styles = getStyles(theme, selectedView);
    
    return (
        <Stack
            direction='row'
            justifyContent='center'
            alignItems='center'
        >
            <Tooltip title='Grid view'>
                <IconButton sx={styles.gridIconButton} onClick={() => onViewChange('grid')}>
                    <GridViewIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title='List view'>
                <IconButton sx={styles.listIconButton} onClick={() => onViewChange('list')}>
                    <ViewListIcon />
                </IconButton>
            </Tooltip>
        </Stack>
    );
};

export default ViewSelector;