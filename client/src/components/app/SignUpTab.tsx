
import { Button, TextField, Paper, Box, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';

import { useAuthentication } from '../../hooks';
import { NOTIFICATION_DELAY } from '../../constants';
import type { AxiosErrorResponse, SignUpPayload, SignUpFormInputs } from '../../types';
import { SignUpUserResolver } from '../../validations';


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
    email: '',
    password: '',
    confirmPassword: ''
};

const SignUpTab = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpFormInputs>({
        resolver: zodResolver(SignUpUserResolver),
        defaultValues: initialValues
    });

    const { loginMutation, signUpMutation } = useAuthentication();
    const username = watch('username');
    const password = watch('password');
    const [signUpFailed, setSignUpFailed] = useState<AxiosErrorResponse | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if(signUpMutation.status === 'error') {
            setSignUpFailed(signUpMutation.failureReason);
            timeoutRef.current = setTimeout(() => {
                setSignUpFailed(null);
            }, NOTIFICATION_DELAY);
        }
        return () => {
            if(timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [signUpMutation.failureReason, signUpMutation.status]);

    useEffect(() => {
        if(signUpMutation.status === 'success' && loginMutation.isIdle) {
            loginMutation.mutate({ username, password });
        }
        // Falsely complaining about missing dependencies. Hence disabling the rule here.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signUpMutation.status, username, password, loginMutation.isIdle]);

    const onSubmit = (formData: SignUpFormInputs) => {
        const signUpPayload: SignUpPayload = {
            username: formData.username,
            password: formData.password,
            email: formData.email,
            userType: 'customer',
            isActive: true
        };
        signUpMutation.mutate(signUpPayload);
    };

    const usernameHasError = !!errors.username?.message;
    const passwordHasError = !!errors.password?.message;
    const confirmPasswordHasError = !!errors.confirmPassword?.message;
    const emailHasError = !!errors.email?.message;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Paper sx={styles.paper}>
                <TextField
                    slotProps={{
                        htmlInput: {
                            'data-testid': 'signup-username'
                        }
                    }}
                    placeholder='Username'
                    fullWidth
                    {...register('username')}
                    error={usernameHasError}
                />
                {
                    usernameHasError &&
                    <Typography color='error'>{errors.username?.message}</Typography>
                }
                <TextField
                    slotProps={{
                        htmlInput: {
                            'data-testid': 'signup-email'
                        }
                    }}
                    placeholder='Email'
                    fullWidth
                    {...register('email')}
                    error={emailHasError}
                />
                {
                    emailHasError &&
                    <Typography color='error'>{errors.email?.message}</Typography>
                }
                <TextField
                    slotProps={{
                        htmlInput: {
                            'data-testid': 'signup-password'
                        }
                    }}
                    placeholder='Password'
                    fullWidth
                    {...register('password')}
                    type='password'
                    error={passwordHasError}
                />
                {
                    passwordHasError &&
                    <Typography color='error'>{errors.password?.message}</Typography>
                }
                <TextField
                    slotProps={{
                        htmlInput: {
                            'data-testid': 'signup-confirm-password'
                        }
                    }}
                    placeholder='Confirm Password'
                    fullWidth
                    {...register('confirmPassword')}
                    type='password'
                    error={confirmPasswordHasError}
                />
                {
                    confirmPasswordHasError &&
                    <Typography color='error'>{errors.confirmPassword?.message}</Typography>
                }
                {
                    signUpFailed && signUpFailed.response?.data.message &&
                    <Typography color='error'>{signUpFailed.response?.data.message}</Typography>
                }
                <Box sx={styles.loginButtonContainer}>
                    <Button 
                        data-testid='signup-submit'
                        type='submit' 
                        variant='contained'
                        disabled={signUpMutation.isPending || loginMutation.isPending}
                    >
                        {signUpMutation.isPending || loginMutation.isPending ? 'Signing Up...' : 'Sign Up'}
                    </Button>
                </Box>
            </Paper>
        </form>
    );
};

export default SignUpTab;