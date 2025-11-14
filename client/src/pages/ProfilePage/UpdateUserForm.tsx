import { useForm } from 'react-hook-form';
import { Box, Button, Stack, Typography, useTheme, type SxProps, type Theme } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import * as R from 'ramda';

import { UpdateUserResolver, type UpdateUserFormData } from '../../validations';
import { CustomTextField as TextField } from '../../components';
import { useAuthContext } from '../../contexts';
import useUpdateProfile from '../../hooks/useUpdateProfile';
import { useEffect, useState } from 'react';
import { NOTIFICATION_DELAY } from '../../constants';

type Styles = {
    rootStack: SxProps<Theme>;
    usernameEmailStack: SxProps<Theme>;
    container: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        rootStack: {
            padding: '0.5rem'
        },
        usernameEmailStack: {
            flexDirection: {
                md: 'row',
                xs: 'column'
            },
            justifyContent: {
                md: 'space-between',
                xs: 'flex-start'
            }
        },
        container: {
            width: {
                xs: '100%'
            },
            flexGrow: 1
        }
    };
};

const USERNAME_FIELD = 'username';
const EMAIL_FIELD = 'email';
const NEW_PASSWORD = 'password';
const CONFIRM_PASSWORD = 'confirmPassword';


const ErrorText = ({ isError, errorMessage }: { isError: boolean, errorMessage: string }) => {
    if(!isError) {
        return null;
    }
    return (
        <Typography color='error'>{errorMessage}</Typography>
    );
};

const UpdateUserForm = () => {
    const theme = useTheme();
    const { username, email } = useAuthContext();
    const updateProfile = useUpdateProfile();
    const styles = getStyles(theme);
    const [responseErr, setResponseErr] = useState('');
    const isResponseError = !!responseErr;

    const defaultValues: UpdateUserFormData = {
        [USERNAME_FIELD]: username || '',
        [EMAIL_FIELD]: email || '',
        [NEW_PASSWORD]: '',
        [CONFIRM_PASSWORD]: ''
    };
    
    const { formState, register, handleSubmit } = useForm<UpdateUserFormData>({
        defaultValues,
        resolver: zodResolver(UpdateUserResolver)
    });

    useEffect(() => {
        setResponseErr(updateProfile.error?.response?.data.message || '');
        setTimeout(() => {
            setResponseErr('');
        }, NOTIFICATION_DELAY);
    }, [updateProfile.error?.response?.data.message]);

    const onSubmit = (formData: UpdateUserFormData) => {
        updateProfile.mutate(formData);
    };

    const isNewPasswordDirty = formState.dirtyFields[NEW_PASSWORD];
    const isError = !R.isEmpty(formState.errors);
    

    return (
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
            <Stack sx={styles.rootStack} gap={'1.5rem'}>
                <Stack sx={styles.usernameEmailStack} alignItems={'center'} gap={'1rem'}>
                    <Box sx={styles.container}>
                        <Typography>Username</Typography>
                        <TextField fullWidth {...register(USERNAME_FIELD)} error={!!formState.errors[USERNAME_FIELD]}/>
                    </Box>
                    <Box sx={styles.container}>
                        <Typography>Email</Typography>
                        <TextField fullWidth {...register(EMAIL_FIELD)} error={!!formState.errors[EMAIL_FIELD]}/>
                    </Box>
                </Stack>
                <ErrorText isError={!!formState.errors[USERNAME_FIELD]} errorMessage={formState.errors[USERNAME_FIELD]?.message || ''}/>
                <ErrorText isError={!!formState.errors[EMAIL_FIELD]} errorMessage={formState.errors[EMAIL_FIELD]?.message || ''}/>
                
                <Box>
                    <Typography>New Password</Typography>
                    <TextField type='password' fullWidth {...register(NEW_PASSWORD)} error={!!formState.errors[NEW_PASSWORD]}/>
                    <ErrorText isError={!!formState.errors[NEW_PASSWORD]} errorMessage={formState.errors[NEW_PASSWORD]?.message || ''}/>
                </Box>
                
                <Box>
                    <Typography>Confirm Password</Typography>
                    <TextField type='password' fullWidth disabled={!isNewPasswordDirty} {...register(CONFIRM_PASSWORD)} error={!!formState.errors[NEW_PASSWORD]}/>
                    <ErrorText isError={!!formState.errors[CONFIRM_PASSWORD]} errorMessage={formState.errors[CONFIRM_PASSWORD]?.message || ''}/>
                </Box>
                
                <Stack direction={'column'} justifyContent={'flex-start'} alignItems={'center'}>
                    {
                        isResponseError &&
                        <ErrorText isError={isResponseError} errorMessage={responseErr}/>
                    }
                    <Button disabled={isError || !formState.isDirty} type='submit' variant='contained'>Update Profile</Button>
                </Stack>
            </Stack>
        </form>
    );
};

export default UpdateUserForm;