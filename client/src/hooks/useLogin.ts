import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/auth';

const useLogin = () => {
    const mutation = useMutation({
        mutationFn: loginApi,
        onSuccess: (data) => {
            console.log('Log in successful!', data);
        },
        onError: (err) => {
            console.error('Log in failed', err);
        },
    });
    return mutation;
};

export default useLogin;