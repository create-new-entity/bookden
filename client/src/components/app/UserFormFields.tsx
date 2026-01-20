import { Box, Button, Stack, Typography, useTheme, type SxProps, type Theme } from '@mui/material';
import { useEffect } from 'react';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import * as R from 'ramda';

import { CustomTextField } from '../custom';
import type { CreateOrUpdateUserMode } from '../../types';

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

export const ErrorText = ({ isError, errorMessage }: { isError: boolean, errorMessage: string }) => {
    if(!isError) {
        return null;
    }
    return (
        <Typography sx={{ marginTop: '0.3rem' }} variant="body1" color="error">{errorMessage}</Typography>
    );
};


type UserFormFieldsProps<FormType extends FieldValues> = {
    form: UseFormReturn<FormType>;

    passwordFieldName: Path<FormType>;
    confirmPasswordFieldName: Path<FormType>;
    usernameFieldName: Path<FormType>;
    emailFieldName: Path<FormType>;

    isResponseError: boolean;
    responseErrorMessage: string;
    isCustomer: boolean;

    handleDeleteAccount?: () => void;
    isPending?: boolean;
    hasChangedAvatar?: boolean;
    mode: CreateOrUpdateUserMode
};

const UserFormFields = <FormType extends FieldValues>( props: UserFormFieldsProps<FormType> ) => {
    const {
        form,
        passwordFieldName,
        confirmPasswordFieldName,
        usernameFieldName,
        emailFieldName,
        isResponseError,
        responseErrorMessage,
        isCustomer,
        handleDeleteAccount,
        isPending,
        mode,
        hasChangedAvatar
    } = props;
    const theme = useTheme();
    const styles = getStyles(theme);

    const { formState, register, watch, clearErrors, resetField, getFieldState } = form;
    
    const newPassword = watch(passwordFieldName);
    const isError = !R.isEmpty(formState.errors);

    // Interesting: https://chatgpt.com/share/692ea3a1-28fc-8012-9a1a-dafa77018a08
    const isNewPasswordDirty = getFieldState(passwordFieldName).isDirty;

    useEffect(() => {
        if(!newPassword) {
            clearErrors(confirmPasswordFieldName);
            resetField(confirmPasswordFieldName);
        }
    }, [newPassword, clearErrors, resetField, confirmPasswordFieldName]);

    const getButtonText = () => {
        if(mode === 'create') {
            return isPending ? 'Creating Admin User...' : 'Create Admin User';
        }
        return isPending ? 'Updating Profiling...' : 'Update Profile';
    };
    
    return (
        <Stack sx={styles.rootStack} gap={'1.5rem'}>
            <Stack sx={styles.usernameEmailStack} alignItems={'center'} gap={'1rem'}>
                <Box sx={styles.container}>
                    <Typography>Username</Typography>
                    <CustomTextField slotProps={{ htmlInput: { 'data-testid': 'username-field' } }} fullWidth {...register(usernameFieldName)} error={!!formState.errors[usernameFieldName]}/>
                    <ErrorText isError={!!formState.errors[usernameFieldName]} errorMessage={String(formState.errors[usernameFieldName]?.message)}/>
                </Box>
                <Box sx={styles.container}>
                    <Typography>Email</Typography>
                    <CustomTextField slotProps={{ htmlInput: { 'data-testid': 'email-field' } }} fullWidth {...register(emailFieldName)} error={!!formState.errors[emailFieldName]}/>
                    <ErrorText isError={!!formState.errors[emailFieldName]} errorMessage={String(formState.errors[emailFieldName]?.message)}/>
                </Box>
            </Stack>
            
            
            <Box>
                <Typography>New Password</Typography>
                <CustomTextField slotProps={{ htmlInput: { 'data-testid': 'new-password-field' } }} type='password' fullWidth {...register(passwordFieldName)} error={!!formState.errors[passwordFieldName]}/>
                <ErrorText isError={!!formState.errors[passwordFieldName]} errorMessage={String(formState.errors[passwordFieldName]?.message)}/>
            </Box>
            
            <Box>
                <Typography>Confirm Password</Typography>
                <CustomTextField slotProps={{ htmlInput: { 'data-testid': 'confirm-password-field' } }} type='password' fullWidth disabled={!isNewPasswordDirty} {...register(confirmPasswordFieldName)} error={!!formState.errors[confirmPasswordFieldName]}/>
                <ErrorText isError={!!formState.errors[confirmPasswordFieldName]} errorMessage={String(formState.errors[confirmPasswordFieldName]?.message)}/>
            </Box>
            
            <Stack direction={'column'} justifyContent={'flex-start'} alignItems={'center'}>
                {
                    isResponseError &&
                    <ErrorText isError={isResponseError} errorMessage={responseErrorMessage}/>
                }
                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} gap={`${theme.spacing(1)}`}>
                    {
                        isCustomer &&
                        <Button
                            data-testid='delete-profile-button'
                            variant='contained'
                            color='error'
                            onClick={handleDeleteAccount}
                        >
                            Delete Profile
                        </Button>
                    }
                    <Button 
                        data-testid='submit-button'
                        disabled={ isError || !(hasChangedAvatar || formState.isDirty) || isPending } 
                        type='submit' 
                        variant='contained'
                    >
                        {getButtonText()}
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    );
};


export default UserFormFields;