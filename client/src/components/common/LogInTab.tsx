import { Button, TextField, Paper, Box, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';

import type { LoginFormInputs, AxiosErrorResponse } from '../../types';
import { useAuthentication } from '../../hooks';
import { NOTIFICATION_DELAY } from '../../constants';
import { LogInResolver } from '../../validations';

const styles: Record<string, React.CSSProperties> = {
    paper: {
        width: '100%',
        padding: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '0.5rem'
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

const LogInTab = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
        resolver: zodResolver(LogInResolver),
        defaultValues: initialValues
    });

    const [loginFailed, setLoginFailed] = useState<AxiosErrorResponse | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { loginMutation } = useAuthentication();

    useEffect(() => {
        if(loginMutation.status === 'error') {
            setLoginFailed(loginMutation.failureReason);
            timeoutRef.current = setTimeout(() => {
                setLoginFailed(null);
            }, NOTIFICATION_DELAY);
        }
        return () => {
            if(timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
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
                    loginFailed && loginFailed.response?.data.message &&
                    <Typography color='error'>{loginFailed.response.data.message}</Typography>
                }
                <Box sx={styles.loginButtonContainer}>
                    <Button 
                        type='submit' 
                        variant='contained'
                        disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending ? 'Logging In...' : 'Log In'}
                    </Button>
                </Box>
            </Paper>
        </form>
    );
};

export default LogInTab;