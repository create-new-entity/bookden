import { useMutation } from '@tanstack/react-query';
import type { AxiosErrorResponse } from '../types';
import type { UpdateUserPayload } from '../types/UpdateUser';
import { updateProfile } from '../api/profile';
import type { AxiosResponse } from 'axios';
import { useAuthContext } from '../contexts';


const useUpdateProfile = () => {
    const { token } = useAuthContext();
    const updateProfileMutation = useMutation<AxiosResponse, AxiosErrorResponse, UpdateUserPayload>({
        mutationFn: (updateUserPayload: UpdateUserPayload) => {
            return updateProfile(updateUserPayload, token);
        },
        onSuccess: () => {
            console.log('update successful');
        },
        onError: (error) => {
            console.log('error', error);
        }
    });

    return updateProfileMutation;
};

export default useUpdateProfile;