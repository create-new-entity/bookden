

import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import IconButton from '@mui/material/IconButton';

import { useResponsive } from '../../../../hooks';


type CarouselDotButtonProps = {
    isSelected: boolean;
    onClick: () => void;
};

const CarouselDotButton = (props: CarouselDotButtonProps) => {
    const { isSelected, onClick } = props;

    const { isXs} = useResponsive();

    const iconFontSize = isXs ? 'small' : 'medium';

    return (
        <>
            {
                isSelected
                    ?
                    <IconButton onClick={onClick}>
                        <CircleIcon fontSize={iconFontSize}/>
                    </IconButton>
                    :
                    <IconButton onClick={onClick}>
                        <CircleOutlinedIcon fontSize={iconFontSize}/>
                    </IconButton>
            }
        </>
    );
};


export default CarouselDotButton;