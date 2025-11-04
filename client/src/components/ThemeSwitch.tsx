import { Stack, Switch } from '@mui/material';
import useThemeModeContext from '../contexts/ThemeModeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import ModeNightIcon from '@mui/icons-material/ModeNight';

const ThemeSwitch = () => {
    const {  isLightMode, handleThemeModeSwitch } = useThemeModeContext();

    return (
        <Stack direction={'row'} alignItems={'center'}>
            <LightModeIcon fontSize='small'/>
            <Switch checked={!isLightMode} onChange={handleThemeModeSwitch}/>
            <ModeNightIcon fontSize='small'/>
        </Stack>
    );
};

export default ThemeSwitch;