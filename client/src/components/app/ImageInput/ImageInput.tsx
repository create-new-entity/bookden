import type { RefObject } from 'react';
import {
    Avatar, type SxProps, type Theme,
    Badge, Stack, IconButton, useTheme,
    Tooltip
} from '@mui/material';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import ImagePicker from './ImagePicker';


const GAP_BETWEEN_UPDATE_OR_DELETE_BUTTONS = '0.1rem';
const ADD_BUTTON_BADGE_CONTENT_MARGIN_LEFT = '1.7rem';
const UPDATE_OR_DELETE_BUTTONS_BADGE_CONTENT_MARGIN_LEFT = '3.5rem';

type Styles = {
    badgeContentStack: SxProps<Theme>;
    updateOrDeleteButtonsStack: SxProps<Theme>;
};

const getStyles = (_theme: Theme, badgeContentMarginLeft?: string): Styles => {
    return {
        badgeContentStack: {
            marginLeft: badgeContentMarginLeft
        },
        updateOrDeleteButtonsStack: {
            '& .MuiIconButton-root': {
                padding: '0'
            }
        }
    };
};


type UpdateOrDeleteButtonsProps = {
    inputRef: RefObject<HTMLInputElement | null>;
    clearImageFile: () => void;
};

const UpdateOrDeleteButtons = (props: UpdateOrDeleteButtonsProps) => {
    const theme = useTheme();

    const styles = getStyles(theme);
    const { inputRef, clearImageFile } = props;
    return (
        <Stack
            direction={'row'}
            justifyContent={'flex-start'}
            alignItems={'center'}
            sx={styles.updateOrDeleteButtonsStack}
            gap={GAP_BETWEEN_UPDATE_OR_DELETE_BUTTONS}
        >
            <Tooltip title='Update image'>
                <IconButton onClick={() => inputRef.current?.click()}>
                    <ChangeCircleIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title='Delete image'>
                <IconButton onClick={clearImageFile}>
                    <DeleteIcon/>
                </IconButton>
            </Tooltip>
        </Stack>
    );
};


type AddButtonProps = {
    inputRef: RefObject<HTMLInputElement | null>;
};

const AddButton = (props: AddButtonProps) => {
    const { inputRef } = props;
    return (
        <Tooltip title='Add image'>
            <IconButton onClick={() => inputRef.current?.click()}>
                <AddCircleIcon/>
            </IconButton>
        </Tooltip>
    );
};

type BadgeContentProps = {
    objectUrl: string | undefined;
    inputRef: RefObject<HTMLInputElement | null>;
    clearImageFile: () => void;
};

const BadgeContent = (props: BadgeContentProps) => {
    const theme = useTheme();

    const { objectUrl, inputRef, clearImageFile } = props;
    const badgeContentMarginLeft = objectUrl ? UPDATE_OR_DELETE_BUTTONS_BADGE_CONTENT_MARGIN_LEFT : ADD_BUTTON_BADGE_CONTENT_MARGIN_LEFT;
    const styles = getStyles(theme, badgeContentMarginLeft);

    let badgeContent = null;

    if(objectUrl) {
        badgeContent = (
            <UpdateOrDeleteButtons
                inputRef={inputRef}
                clearImageFile={clearImageFile}
            />
        );
    }
    else {
        badgeContent = (
            <AddButton inputRef={inputRef}/>
        );
    }

    return (
        <Stack
            sx={styles.badgeContentStack}
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
        >
            {badgeContent}
        </Stack>
    );
};


type ImageInputProps = {
    inputRef: RefObject<HTMLInputElement | null>;
    onSelectImagePicked: (file: File) => void; // What to do when the user selects an image.
    avatarStyles: SxProps<Theme>;
    objectUrl: string | undefined;
    alt: string;
    defaultPlaceholderImageUrl: string;
    clearImageFile: () => void;
    disableActionButtons?: boolean;
};


const ImageInput = (props: ImageInputProps) => {
    const {
        inputRef, onSelectImagePicked, avatarStyles, objectUrl,
        alt, defaultPlaceholderImageUrl, clearImageFile, disableActionButtons
    } = props;

    const badgeContent = disableActionButtons ? null : <BadgeContent
        objectUrl={objectUrl}
        inputRef={inputRef}
        clearImageFile={clearImageFile}
    />;

    return (
        <>
            <ImagePicker
                inputRef={inputRef}
                onSelect={onSelectImagePicked}
            />
            <Badge badgeContent={badgeContent}>
                <Avatar
                    sx={avatarStyles}
                    src={objectUrl || defaultPlaceholderImageUrl}
                    alt={alt}
                    variant='rounded'
                />
            </Badge>
        </>
    );
};


export default ImageInput;