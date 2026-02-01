import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';

import { UpdateUserResolver, type UpdateUserFormData } from '../../validations';
import { useAuthContext, useAvatarContext, useNotificationContext } from '../../contexts';
import {
    AVATAR_DIMENSIONS, CONFIRM_PASSWORD, CUSTOMER,
    EMAIL_FIELD, NEW_PASSWORD, NOTIFICATION_DELAY,
    PLACE_HOLDER_AVATAR, USERNAME_FIELD
} from '../../constants';
import { useAvatar, useImagePreview, useUpdateProfile } from '../../hooks';
import UserFormFields from './UserFormFields';
import { deleteUser } from '../../api';
import type { SxProps, Theme } from '@mui/material';
import { Stack, useTheme } from '@mui/material';
import { ImageInput } from './ImageInput';
import { urlToFile } from '../../utility';


type Styles = {
    avatar: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        avatar: {
            width: `${AVATAR_DIMENSIONS}px`,
            height: `${AVATAR_DIMENSIONS}px`
        }
    };
};
const UpdateUserForm = () => {
    const theme = useTheme();
    const styles = getStyles(theme);
    const { username, email, userType, token, userId, clearAuthentication } = useAuthContext();
    const { mutation: updateUserMutation } = useUpdateProfile();
    const [responseErr, setResponseErr] = useState('');
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { addOrUpdateAvatarMutation } = useAvatar();
    const { avatarUrl } = useAvatarContext();
    const { handleShowNotification } = useNotificationContext();

    const {
        objectUrl, selectFile,
        clearImageFile, file, isCleared: isImageCleared
    } = useImagePreview({
        initialImageUrl: avatarUrl,
        placeholderImageUrl: PLACE_HOLDER_AVATAR
    });
    

    const isUpdateSuccess = updateUserMutation.isSuccess && addOrUpdateAvatarMutation.isSuccess;
    useEffect(() => {
        if(isUpdateSuccess) {
            handleShowNotification('Profile updated successfully.');
        }
    }, [isUpdateSuccess, handleShowNotification]);
    
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

    const onSubmit = async (formData: UpdateUserFormData) => {
        updateUserMutation.mutate(formData);
        if(file) {
            addOrUpdateAvatarMutation.mutate(file);
            return;
        }

        if (isImageCleared) {
            // User has cleared the image. Use the placeholder image.
            const placeholderFile = await urlToFile(
                PLACE_HOLDER_AVATAR,
                'noBookCoverPlaceholder.jpg',
                'image/jpeg'
            );
            addOrUpdateAvatarMutation.mutate(placeholderFile);
        }
    };
    
    const handleDeleteAccount = async () => {
        try {
            await deleteUser(token, userId);
            clearAuthentication();
        } catch (error) {
            console.error('Failed to delete account.', error);
        }
    };

    const hasChangedAvatar = !!file || isImageCleared;

    return (
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
            <Stack
                direction='row'
                justifyContent='center'
                alignItems='center'
            >
                <ImageInput
                    inputRef={inputRef}
                    onSelectImagePicked={selectFile}
                    avatarStyles={styles.avatar}
                    objectUrl={objectUrl}
                    alt={'Profile Avatar'}
                    defaultPlaceholderImageUrl={PLACE_HOLDER_AVATAR}
                    clearImageFile={clearImageFile}
                />
            </Stack>
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
                isPending={updateUserMutation.isPending || addOrUpdateAvatarMutation.isPending}
                hasChangedAvatar={hasChangedAvatar}
            />
        </form>
    );
};

export default UpdateUserForm;