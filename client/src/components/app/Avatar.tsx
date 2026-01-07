

import { useRef, type ReactNode, type RefObject } from 'react';
import { IconButton, Stack, useTheme } from '@mui/material';
import type { Theme, SxProps } from '@mui/material/styles';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { useAvatar } from '../../hooks';
import { IMAGE_MIME_TYPES } from '../../constants';

type IconButtonStyles = {
    iconButton: SxProps<Theme>;
    addUpdateAvatarStack: SxProps<Theme>;
};

const getStyles = (_theme: Theme): IconButtonStyles => {
    return {
        iconButton: {
            padding: 0
        },
        addUpdateAvatarStack: {
            marginLeft: '1.5rem'
        }
    };
};

type AddUpdateAvatarWrapperProps = {
    inputRef: RefObject<HTMLInputElement | null>;
    children: ReactNode;
};

const AddUpdateAvatarWrapper = ({ inputRef, children }: AddUpdateAvatarWrapperProps) => {
    const { addOrUpdateMutation } = useAvatar();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            addOrUpdateMutation.mutate(file);
            event.target.value = '';
        }
    };

    return (
        <>
            <input
                type="file"
                accept={IMAGE_MIME_TYPES.join(', ')}
                hidden
                ref={inputRef}
                onChange={handleFileChange}
            />
            { children }
        </>
    );
};

export const AddAvatarButton = () => {
    const theme = useTheme();
    const styles = getStyles(theme);
    const inputRef = useRef<HTMLInputElement>(null);
    
    return (
        <AddUpdateAvatarWrapper inputRef={inputRef}>
            <IconButton sx={styles.iconButton} onClick={() => inputRef.current?.click()}>
                <AddCircleIcon/>
            </IconButton>
        </AddUpdateAvatarWrapper>
    );
};

export const UpdateOrDeleteAvatarButtonsStack = () => {
    const theme = useTheme();
    const styles = getStyles(theme);
    const { deleteAvatarMutation } = useAvatar();
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <Stack
            direction={'row'}
            justifyContent={'flex-start'}
            alignItems={'center'}
            sx={styles.addUpdateAvatarStack}
        >
            <AddUpdateAvatarWrapper inputRef={inputRef}>
                <IconButton sx={styles.iconButton} onClick={() => inputRef.current?.click()}>
                    <ChangeCircleIcon/>
                </IconButton>
            </AddUpdateAvatarWrapper>
            <IconButton sx={styles.iconButton} onClick={() => deleteAvatarMutation.mutate() }>
                <DeleteIcon/>
            </IconButton>
        </Stack>
    );
};