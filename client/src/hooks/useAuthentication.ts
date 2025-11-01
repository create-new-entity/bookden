import { useMutation } from '@tanstack/react-query';
import { loginApi, signUpApi } from '../api/auth.ts';
import type { LoginFormInputs, SignUpPayload } from '../types/index.ts';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../contexts/AuthContext.tsx';
import type { AxiosErrorResponse } from '../types/UtilTypes.ts';
import type { AxiosResponse } from 'axios';

const useAuthentication = () => {
    const navigate = useNavigate();
    const { handleLoggedInContext } = useAuthContext();

    const loginMutation = useMutation<string, AxiosErrorResponse, LoginFormInputs>({
        mutationFn: loginApi,
        onSuccess: (token) => {
            handleLoggedInContext(token);
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