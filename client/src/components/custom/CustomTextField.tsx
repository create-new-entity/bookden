
import { TextField, type TextFieldProps } from '@mui/material';

type CustomTextFieldProps = TextFieldProps & {
    'data-testid'?: string;
};
const CustomTextField = (props: CustomTextFieldProps) => {
    return <TextField {...props} slotProps={props.slotProps}/>;
};

export default CustomTextField;