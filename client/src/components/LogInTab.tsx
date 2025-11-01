import { Button, TextField, Paper, Box, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import type { LoginFormInputs } from '../types/LogIn';
import useLogin from '../hooks/useLogin';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { colors } from '../theme/theme';


const styles: Record<string, React.CSSProperties> = {
    paper: {
        width: '100%',
        padding: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: colors.paleMint
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

const loginResolver = z.object({
    username: z.string().min(6).max(30),
    password: z.string().min(6).max(250)
});

const LogInTab = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginResolver),
        defaultValues: initialValues
    });

    const logInMutation = useLogin();

    const onSubmit = (formData: LoginFormInputs) => {
        logInMutation.mutate(formData);
    };

    const usernameHasError = !!errors.username?.message;
    const passwordHasError = !!errors.password?.message;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Paper sx={styles.paper}>
                <TextField
                    placeholder='Username'
                    fullWidth
                    {...register('username')}
                    error={usernameHasError}
                />
                <TextField
                    placeholder='Password'
                    fullWidth
                    {...register('password')}
                    type='password'
                    error={passwordHasError}
                />
                {
                    usernameHasError &&
                    <Typography color='error'>{errors.username?.message}</Typography>
                }
                {
                    passwordHasError &&
                    <Typography color='error'>{errors.password?.message}</Typography>
                }
                {
                    logInMutation.status === 'error' && logInMutation.failureReason && logInMutation.failureReason.response &&
                    <Typography color='error'>{logInMutation.failureReason.response.data.message}</Typography>
                }
                <Box sx={styles.loginButtonContainer}>
                    <Button type='submit'>Log In</Button>
                </Box>
            </Paper>
        </form>
    );
};

export default LogInTab;