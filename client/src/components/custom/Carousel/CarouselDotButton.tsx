

import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import IconButton from '@mui/material/IconButton';



type CarouselDotButtonProps = {
    isSelected: boolean;
    onClick: () => void;
};

const CarouselDotButton = (props: CarouselDotButtonProps) => {
    const { isSelected, onClick } = props;

    return (
        <>
            {
                isSelected
                    ?
                    <IconButton onClick={onClick}>
                        <CircleIcon/>
                    </IconButton>
                    :
                    <IconButton onClick={onClick}>
                        <CircleOutlinedIcon/>
                    </IconButton>
            }
        </>
    );
};


export default CarouselDotButton;