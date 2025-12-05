import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';

import { CreateAdminUserResolver, type CreateAdminUserFormData } from '../../validations';
import { CONFIRM_PASSWORD, EMAIL_FIELD, NEW_PASSWORD, NOTIFICATION_DELAY, USERNAME_FIELD } from '../../constants';
import { useCreateAdminUser } from '../../hooks';
import UserFormFields from './UserFormFields';

const CreateAdminUserForm = () => {
    const { mutation: createAdminUserMutation } = useCreateAdminUser();
    const [responseErr, setResponseErr] = useState('');
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isResponseError = !!responseErr;
    const isCustomer = false;

    const defaultValues: CreateAdminUserFormData = {
        [USERNAME_FIELD]: '',
        [EMAIL_FIELD]: '',
        [NEW_PASSWORD]: '',
        [CONFIRM_PASSWORD]: ''
    };
    
    const form = useForm<CreateAdminUserFormData>({
        defaultValues,
        resolver: zodResolver(CreateAdminUserResolver)
    });

    const { handleSubmit, watch, clearErrors, resetField } = form;

    const newPassword = watch(NEW_PASSWORD);

    useEffect(() => {
        if(!newPassword) {
            clearErrors(CONFIRM_PASSWORD);
            resetField(CONFIRM_PASSWORD);
        }
    }, [newPassword, clearErrors, resetField]);

    useEffect(() => {
        if(createAdminUserMutation.error?.response?.data.message) {
            setResponseErr(createAdminUserMutation.error.response.data.message);
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
    }, [createAdminUserMutation.error?.response?.data.message]);

    const onSubmit = (formData: CreateAdminUserFormData) => {
        createAdminUserMutation.mutate(formData);
    };

    return (
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
            <UserFormFields
                mode='create'
                form={form}
                passwordFieldName={NEW_PASSWORD}
                confirmPasswordFieldName={CONFIRM_PASSWORD}
                usernameFieldName={USERNAME_FIELD}
                emailFieldName={EMAIL_FIELD}
                isResponseError={isResponseError}
                responseErrorMessage={responseErr}
                isCustomer={isCustomer}
                isPending={createAdminUserMutation.isPending}
            />
        </form>
    );
};

export default CreateAdminUserForm;