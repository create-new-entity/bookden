import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { AxiosResponse } from 'axios';

import type { AxiosErrorResponse, LoggedInUserData, LoginFormInputs, SignUpPayload } from '../types';
import { useAuthContext } from '../contexts';
import { loginApi, signUpApi } from '../api';


const useAuthentication = () => {
    const navigate = useNavigate();
    const { handleLoggedInContext } = useAuthContext();

    const loginMutation = useMutation<LoggedInUserData, AxiosErrorResponse, LoginFormInputs>({
        mutationFn: loginApi,
        onSuccess: (data) => {
            handleLoggedInContext(data);
            navigate('/');
        },
        onError: (err) => {
            console.error('Log in failed', err);
        },
    });

    const signUpMutation = useMutation<AxiosResponse, AxiosErrorResponse, SignUpPayload>({
        mutationFn: signUpApi
    });

    return {
        loginMutation, signUpMutation
    };
};

export default useAuthentication;