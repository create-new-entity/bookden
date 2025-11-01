import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/auth';
import type { LoginFormInputs } from '../types/index.ts';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../contexts/AuthContext.tsx';
import type { AxiosErrorResponse } from '../types/UtilTypes.ts';

const useLogin = () => {
    const navigate = useNavigate();
    const { handleLoggedInContext } = useAuthContext();
    const mutation = useMutation<string, AxiosErrorResponse, LoginFormInputs>({
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