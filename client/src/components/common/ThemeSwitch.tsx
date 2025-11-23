import { Stack, Switch } from '@mui/material';
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

    return (
        <Stack direction={'row'} alignItems={'center'}>
            <LightModeIcon fontSize='small'/>
            <Switch checked={!isLightMode} onChange={handleSwitch}/>
            <ModeNightIcon fontSize='small'/>
        </Stack>
    );
};

export default ThemeSwitch;