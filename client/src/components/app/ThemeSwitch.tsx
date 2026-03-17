


import { IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import ModeNightIcon from '@mui/icons-material/ModeNight';

import { useNavContext, useThemeModeContext } from '../../contexts';

const ThemeSwitch = () => {
    const {  isLightMode, handleThemeModeSwitch } = useThemeModeContext();
    const { setShowNavDrawer } = useNavContext();

    const handleSwitch = () => {
        handleThemeModeSwitch();
        setShowNavDrawer(false);
    };

    const lightModeIcon = (
        <Tooltip title='Light mode'>
            <IconButton onClick={handleSwitch}>
                <LightModeIcon fontSize='medium'/>
            </IconButton>
        </Tooltip>
    );

    const darkModeIcon = (
        <Tooltip title='Dark mode'>
            <IconButton onClick={handleSwitch}>
                <ModeNightIcon fontSize='medium'/>
            </IconButton>
        </Tooltip>
    );

    return (
        <>
            {
                isLightMode ? darkModeIcon : lightModeIcon
            }
        </>
    );
};

export default ThemeSwitch;