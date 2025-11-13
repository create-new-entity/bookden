
import { Button, TextField, Paper, Box, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';

import { useAuthentication } from '../../hooks';
import { NOTIFICATION_DELAY } from '../../constants';
import type { AxiosErrorResponse, SignUpPayload, SignUpFormInputs } from '../../types';


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

const signUpResolver = z.object({
    username: z.string().trim().toLowerCase().min(6).max(30),
    password: z.string().trim().min(6).max(250),
    email: z.email('Please enter a valid email address.').trim().toLowerCase().min(5).max(250),
    confirmPassword: z.string()
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: 'custom',
            path: ['confirmPassword'],
            message: 'Passwords do not match.',
        });
    }
});

const SignUpTab = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpFormInputs>({
        resolver: zodResolver(signUpResolver),
        defaultValues: initialValues
    });

    const { loginMutation, signUpMutation } = useAuthentication();
    const formValues = watch();
    const [signUpFailed, setSignUpFailed] = useState<AxiosErrorResponse | null>(null);

    useEffect(() => {
        if(signUpMutation.status === 'error') {
            setSignUpFailed(signUpMutation.failureReason);
            setTimeout(() => {
                setSignUpFailed(null);
            }, NOTIFICATION_DELAY);
        }
    }, [signUpMutation.failureReason, signUpMutation.status]);

    useEffect(() => {
        if(signUpMutation.status === 'success') {
            loginMutation.mutate({ username: formValues.username, password: formValues.password });
        }
    }, [signUpMutation.status, formValues.username, formValues.password, loginMutation]);

    const onSubmit = (formData: SignUpFormInputs) => {
        const signUpPaylod: SignUpPayload = {
            username: formData.username,
            password: formData.password,
            email: formData.email,
            userType: 'customer',
            isActive: true
        };
        signUpMutation.mutate(signUpPaylod);
    };

    const usernameHasError = !!errors.username?.message;
    const passwordHasError = !!errors.password?.message;
    const confirmPasswordHasError = !!errors.confirmPassword?.message;
    const emailHasError = !!errors.email?.message;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Paper sx={styles.paper}>
                <TextField
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
                    placeholder='Email'
                    fullWidth
                    {...register('email')}
                />
                {
                    emailHasError &&
                    <Typography color='error'>{errors.email?.message}</Typography>
                }
                <TextField
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
                    placeholder='Confirm Password'
                    fullWidth
                    {...register('confirmPassword')}
                    type='password'
                    error={passwordHasError}
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
                    <Button type='submit' variant='contained'>Sign Up</Button>
                </Box>
            </Paper>
        </form>
    );
};

export default SignUpTab;