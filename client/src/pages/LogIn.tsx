import { Button, Container, TextField, Paper, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import type { LoginFormInputs } from '../types.ts/LogIn';

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        maxWidth: '50%',
        padding: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    loginButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
};

const initialValues = {
    username: '',
    password: ''
};

const LogIn = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
        defaultValues: initialValues
    });

    const onSubmit = (formData) => {
        console.log('formData', formData);
    };

    return (
        <Container sx={styles.container}>
            <Paper sx={styles.paper}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        placeholder='Username'
                        fullWidth
                        {...register('username')}
                    />
                    <TextField
                        placeholder='Password'
                        fullWidth
                        {...register('password')}
                    />
                    <Box sx={styles.loginButtonContainer}>
                        <Button type='submit'>Log In</Button>
                        <Button>Sign Up</Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default LogIn;