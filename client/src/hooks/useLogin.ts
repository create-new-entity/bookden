import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/auth';
import type { LoginFormInputs } from '../types/index.ts';
import type { AxiosError, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../contexts/AuthContext.tsx';

const useLogin = () => {
    const navigate = useNavigate();
    const { handleLoggedInContext } = useAuthContext();
    const mutation = useMutation<string, AxiosError<{ message: string, name: string, response: AxiosResponse }>, LoginFormInputs>({
        mutationFn: loginApi,
        onSuccess: (token) => {
            handleLoggedInContext(token);
            navigate('/');
        },
        onError: (err) => {
            console.error('Log in failed', err);
        },
    });
    return mutation;
};

export default useLogin;