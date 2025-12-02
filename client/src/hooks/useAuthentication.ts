import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { AxiosResponse } from 'axios';

import type { AxiosErrorResponse, LoggedInUserData, LoginFormInputs, SignUpPayload } from '../types';
import { useAuthContext } from '../contexts';
import { login, signUp } from '../api';


const useAuthentication = () => {
    const navigate = useNavigate();
    const { saveToken } = useAuthContext();
    
    const loginMutation = useMutation<Pick<LoggedInUserData, 'token'>, AxiosErrorResponse, LoginFormInputs>({
        mutationFn: login,
        onSuccess: (data) => {
            saveToken(data.token);
            navigate('/');
        },
        onError: (err) => {
            console.error('Log in failed', err);
        },
    });

    const signUpMutation = useMutation<AxiosResponse, AxiosErrorResponse, SignUpPayload>({
        mutationFn: signUp
    });

    return {
        loginMutation, signUpMutation
    };
};

export default useAuthentication;