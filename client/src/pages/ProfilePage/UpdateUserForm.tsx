import { useForm } from 'react-hook-form';
import { Box, Button, Stack, Typography, useTheme, type SxProps, type Theme } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import * as R from 'ramda';

import { UpdateUserResolver, type UpdateUserFormData } from '../../validations';
import { CustomTextField as TextField } from '../../components';
import { useAuthContext } from '../../contexts';

type Styles = {
    rootStack: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        rootStack: {
            padding: '0.5rem'
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
    const styles = getStyles(theme);

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

    const onSubmit = (formData: UpdateUserFormData) => {
        console.log('formData', formData);
    };

    const isNewPasswordDirty = formState.dirtyFields[NEW_PASSWORD];
    console.log('formState.errors', formState.errors);
    console.log('formState.dirty', formState.dirtyFields);
    const isError = !R.isEmpty(formState.errors);

    return (
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
            <Stack sx={styles.rootStack} gap={'1.5rem'}>
                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} gap={'1rem'}>
                    <Box sx={{ flexGrow: 1}}>
                        <Typography>Username</Typography>
                        <TextField fullWidth {...register(USERNAME_FIELD)} error={!!formState.errors[USERNAME_FIELD]}/>
                    </Box>
                    <Box sx={{ flexGrow: 1}}>
                        <Typography>Email</Typography>
                        <TextField fullWidth {...register(EMAIL_FIELD)} error={!!formState.errors[EMAIL_FIELD]}/>
                    </Box>
                </Stack>
                <ErrorText isError={!!formState.errors[USERNAME_FIELD]} errorMessage={formState.errors[USERNAME_FIELD]?.message || ''}/>
                <ErrorText isError={!!formState.errors[EMAIL_FIELD]} errorMessage={formState.errors[EMAIL_FIELD]?.message || ''}/>
                
                <Typography>New Password</Typography>
                <TextField {...register(NEW_PASSWORD)} error={!!formState.errors[NEW_PASSWORD]}/>
                <ErrorText isError={!!formState.errors[NEW_PASSWORD]} errorMessage={formState.errors[NEW_PASSWORD]?.message || ''}/>
                
                <Typography>Confirm Password</Typography>
                <TextField disabled={!isNewPasswordDirty} {...register(CONFIRM_PASSWORD)} error={!!formState.errors[NEW_PASSWORD]}/>
                <ErrorText isError={!!formState.errors[CONFIRM_PASSWORD]} errorMessage={formState.errors[CONFIRM_PASSWORD]?.message || ''}/>
                
                <Stack direction={'row'} justifyContent={'center'} alignItems={'center'}>
                    <Button disabled={isError || !formState.isDirty} type='submit' variant='contained'>Update Profile</Button>
                </Stack>
            </Stack>
        </form>
    );
};

export default UpdateUserForm;