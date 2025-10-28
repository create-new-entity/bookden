import { Button, TextField } from "@mui/material";
import type { LogInProps } from "../types.ts/LogIn";
import Paper from '@mui/material/Paper';
import { useForm } from 'react-hook-form';


interface LoginFormInputs {
  username: string;
  password: string;
}

const initialValues = {
    username: '',
    password: ''
};

const LogIn = (props: LogInProps) => {

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
        defaultValues: initialValues
    });

    const onSubmit = (formData) => {
        console.log('formData', formData);
    };

    return (
        <Paper>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    placeholder='username'
                    fullWidth
                    {...register('username')}
                />
                <TextField
                    placeholder='password'
                    fullWidth
                    {...register('password')}
                />
                <Button type='submit'>Log In</Button>
            </form>
        </Paper>
    );
};

export default LogIn;