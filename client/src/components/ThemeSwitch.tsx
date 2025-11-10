import { Stack, Switch } from '@mui/material';
import useThemeModeContext from '../contexts/ThemeModeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import useNavContext from '../contexts/NavContext';

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