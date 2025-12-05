import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';

import { UpdateUserResolver, type UpdateUserFormData } from '../../validations';
import { useAuthContext } from '../../contexts';
import { CONFIRM_PASSWORD, CUSTOMER, EMAIL_FIELD, NEW_PASSWORD, NOTIFICATION_DELAY, USERNAME_FIELD } from '../../constants';
import { useUpdateProfile } from '../../hooks';
import UserFormFields from './UserFormFields';
import { deleteUser } from '../../api';


const UpdateUserForm = () => {
    const { username, email, userType, token, userId, clearAuthentication } = useAuthContext();
    const { mutation: updateUserMutation } = useUpdateProfile();
    const [responseErr, setResponseErr] = useState('');
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isResponseError = !!responseErr;
    const isCustomer = userType === CUSTOMER;

    const defaultValues: UpdateUserFormData = {
        [USERNAME_FIELD]: username || '',
        [EMAIL_FIELD]: email || '',
        [NEW_PASSWORD]: '',
        [CONFIRM_PASSWORD]: ''
    };
    
    const form = useForm<UpdateUserFormData>({
        defaultValues,
        resolver: zodResolver(UpdateUserResolver)
    });

    const { handleSubmit, getValues, reset, watch, clearErrors, resetField } = form;

    const newPassword = watch(NEW_PASSWORD);

    useEffect(() => {
        if(!newPassword) {
            clearErrors(CONFIRM_PASSWORD);
            resetField(CONFIRM_PASSWORD);
        }
    }, [newPassword, clearErrors, resetField]);

    useEffect(() => {
        if(updateUserMutation.error?.response?.data.message) {
            setResponseErr(updateUserMutation.error.response.data.message);
            timeoutRef.current = setTimeout(() => {
                setResponseErr('');
            }, NOTIFICATION_DELAY);
        }
        else {
            setResponseErr('');
            if(timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        }
        return () => {
            if(timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [updateUserMutation.error?.response?.data.message]);

    useEffect(() => {
        /*
            What bug does this useEffect fix:
            1. Let's say current email is superadmin1@gmail.com
            2. Change to superadmin@gmail.com
            3. Hit update -> update succesful
            4. Change email back to superadmin1@gmail.com -> Update button still disabled -> Not good

            Fix:
            After a succesful update, change the default values of the form to the latest updated values.
            This useEffect does that.
        */
        if(updateUserMutation.isSuccess) {
            reset(getValues());
        }
    }, [updateUserMutation.isSuccess, getValues, reset]);

    const onSubmit = (formData: UpdateUserFormData) => {
        updateUserMutation.mutate(formData);
    };
    
    const handleDeleteAccount = async () => {
        try {
            await deleteUser(token, userId);
            clearAuthentication();
        } catch (error) {
            console.error('Failed to delete account.', error);
        }
    };

    return (
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
            <UserFormFields
                mode='update'
                form={form}
                passwordFieldName={NEW_PASSWORD}
                confirmPasswordFieldName={CONFIRM_PASSWORD}
                usernameFieldName={USERNAME_FIELD}
                emailFieldName={EMAIL_FIELD}
                isResponseError={isResponseError}
                responseErrorMessage={responseErr}
                isCustomer={isCustomer}
                handleDeleteAccount={handleDeleteAccount}
                isPending={updateUserMutation.isPending}
            />
        </form>
    );
};

export default UpdateUserForm;