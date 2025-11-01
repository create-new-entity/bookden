import { Button, TextField, Paper, Box, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import type { AxiosErrorResponse } from '../types/UtilTypes';

import type { LoginFormInputs } from '../types/LogIn';
import { customColors } from '../theme/colors';
import { NOTIFICATION_DELAY } from '../constants';
import useAuthentication from '../hooks/useAuthentication';

const styles: Record<string, React.CSSProperties> = {
    paper: {
        width: '100%',
        padding: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: customColors.paleMint
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
    username: z.string().trim().toLowerCase().min(6).max(30),
    password: z.string().min(6).max(250)
});

const LogInTab = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginResolver),
        defaultValues: initialValues
    });

    const [loginFailed, setLoginFailed] = useState<AxiosErrorResponse | null>(null);

    const { loginMutation } = useAuthentication();

    useEffect(() => {
        if(loginMutation.status === 'error') {
            setLoginFailed(loginMutation.failureReason);
            setTimeout(() => {
                setLoginFailed(null);
            }, NOTIFICATION_DELAY);
        }
    }, [loginMutation.failureReason, loginMutation.status]);

    const onSubmit = (formData: LoginFormInputs) => {
        loginMutation.mutate(formData);
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
                    loginFailed && loginFailed.response &&
                    <Typography color='error'>{loginFailed.response.data.message}</Typography>
                }
                <Box sx={styles.loginButtonContainer}>
                    <Button type='submit' variant='contained'>Log In</Button>
                </Box>
            </Paper>
        </form>
    );
};

export default LogInTab;