import {
    Box, Button, Stack,
    Typography, useMediaQuery, useTheme,
    type SxProps, type Theme
} from '@mui/material';
import * as R from 'ramda';

import {
    SingleSelectAutoComplete, CustomTextField, MultiValueFreeInput
} from '../../custom';
import type { CreateUpdateBookData } from '../../../validations/book';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { DEFAULT_GAP, LANGUAGE_OPTIONS } from '../../../constants';
import type { LanguageCode } from '../../../types';
import BookTagsSelect from '../BooksListFilter/BookTagsSelect';
import { ErrorText } from '../UserFormFields';


const TITLE_FIELD_NAME = 'title';
const SYNOPSIS_FIELD_NAME = 'synopsis';
const PAGES_FIELD_NAME = 'pages';
const PRICE_FIELD_NAME = 'price';
const YEAR_PUBLISHED_FIELD_NAME = 'yearPublished';
const ISBN_FIELD_NAME = 'isbn';
const LANGUAGE_FIELD_NAME = 'language';
const AUTHORS_FIELD_NAME = 'authors';
const BOOK_TAGS_FIELD_NAME = 'tags';

type Styles = {
    wrapperBox: SxProps<Theme>;
    languageSelectBox: SxProps<Theme>;
    smallerBox: SxProps<Theme>;
    rootStack: SxProps<Theme>;
    smallFieldsStack: SxProps<Theme>;
    synopsisTextField: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => ({
    rootStack: {
        marginBottom: '2rem'
    },
    wrapperBox: {
        width: '100%',
    },
    languageSelectBox: {
        minWidth: '18%'
    },
    smallerBox: {
        width: {
            xs: '100%',
            md: '10%'
        }
    },
    smallFieldsStack: {
        flexDirection: {
            xs: 'column',
            md: 'row'
        },
        justifyContent: {
            xs: 'flex-start',
            md: 'space-between'
        },
        alignItems: {
            xs: 'stretch',
            md: 'center',
        },
        gap: `${DEFAULT_GAP}px`
    },
    synopsisTextField: {
        maxHeight: '10rem',
        overflow: 'auto'
    }
});



type BookFormFieldsProps = {
    form: UseFormReturn<CreateUpdateBookData>;
    mode: 'create' | 'update';
    onDelete?: () => void;
    isDeletedBook?: boolean;
    onRestore?: () => void;
};

const BookFormFields = (props: BookFormFieldsProps) => {
    const theme = useTheme();
    
    const styles = getStyles(theme);
    const { form, mode, onDelete, isDeletedBook, onRestore } = props;

    const { register, formState } = form;
    const areSmallerFieldsStacked = useMediaQuery(theme.breakpoints.down('md'));
    const smallFieldsHasErrors = !R.isEmpty(R.pick([PAGES_FIELD_NAME, PRICE_FIELD_NAME, YEAR_PUBLISHED_FIELD_NAME, ISBN_FIELD_NAME], formState.errors));
    const smallFieldErrorMessage = R.pipe(
        R.pick([PAGES_FIELD_NAME, PRICE_FIELD_NAME, YEAR_PUBLISHED_FIELD_NAME, ISBN_FIELD_NAME]),
        R.values,
        R.map(R.prop('message')),
        R.join(', ')
    )(formState.errors);
    const hasErrors = !R.isEmpty(formState.errors) || !!smallFieldErrorMessage;

    return (
        <Stack
            sx={styles.rootStack}
            direction={'column'}
            justifyContent={'flex-start'}
            alignItems={'flex-start'}
            gap={`${DEFAULT_GAP}px`}
        >
            <Box sx={styles.wrapperBox}>
                <Typography>Title</Typography>
                <CustomTextField
                    slotProps={{ htmlInput: { 'data-testid': 'title-field' } }}
                    fullWidth {...register('title')}
                    error={!!formState.errors[TITLE_FIELD_NAME]}
                    helperText={
                        formState.errors[TITLE_FIELD_NAME] ? (
                            <Typography variant="body1" color="error" component={'span'}>
                                {formState.errors[TITLE_FIELD_NAME]?.message}
                            </Typography>
                        ) : undefined
                    }
                    disabled={isDeletedBook}
                />
            </Box>
            <Box sx={styles.wrapperBox}>
                <Typography>Synopsis</Typography>
                <CustomTextField
                    sx={styles.synopsisTextField}
                    slotProps={{ htmlInput: { 'data-testid': 'synopsis-field' } }}
                    fullWidth {...register('synopsis')}
                    error={!!formState.errors[SYNOPSIS_FIELD_NAME]}
                    multiline={true}
                    helperText={
                        formState.errors[SYNOPSIS_FIELD_NAME] ? (
                            <Typography variant="body1" color="error" component={'span'}>
                                {formState.errors[SYNOPSIS_FIELD_NAME]?.message}
                            </Typography>
                        ) : undefined
                    }
                    disabled={isDeletedBook}
                />
            </Box>
            <Box sx={styles.wrapperBox}>
                <Stack
                    sx={styles.smallFieldsStack}
                >
                    <Box sx={styles.languageSelectBox}>
                        <Typography>Language</Typography>
                        {
                            /* 
                                Note to future self:
                                form.getValues() returns a snapshot.
                                It does not update when the value changes.
                                So we use a <Controller> to update the value when it changes.

                                <Controller> subscribes to the field inside react-hook-form and
                                re-renders the field when its value changes.
                            */
                        }
                        <Controller
                            name={LANGUAGE_FIELD_NAME}
                            control={form.control}
                            render={({ field }) => (
                                <SingleSelectAutoComplete<LanguageCode>
                                    id="language-select"
                                    label=""
                                    placeholder="Select language"
                                    options={LANGUAGE_OPTIONS}
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={isDeletedBook}
                                />
                            )}
                        />
                    </Box>
                    <Box sx={styles.smallerBox}>
                        <Typography>Pages</Typography>
                        <CustomTextField
                            slotProps={{ htmlInput: { 'data-testid': 'pages-field' } }}
                            type={'number'}
                            fullWidth {...register(PAGES_FIELD_NAME)}
                            error={!!formState.errors[PAGES_FIELD_NAME]}
                            helperText={
                                areSmallerFieldsStacked ? (
                                    <Typography variant="body1" color="error" component={'span'}>
                                        {formState.errors[PAGES_FIELD_NAME]?.message}
                                    </Typography>
                                ) : undefined
                            }
                            disabled={isDeletedBook}
                        />
                    </Box>
                    <Box sx={styles.smallerBox}>
                        <Typography>Price</Typography>
                        <CustomTextField
                            slotProps={{
                                htmlInput: {
                                    'data-testid': 'price-field',
                                    step: 'any' // Otherwise it complains for values like 9.99 and so on.
                                }
                            }}
                            type={'number'}
                            fullWidth {...register(PRICE_FIELD_NAME)}
                            error={!!formState.errors[PRICE_FIELD_NAME]}
                            helperText={
                                areSmallerFieldsStacked ? (
                                    <Typography variant="body1" color="error" component={'span'}>
                                        {formState.errors[PRICE_FIELD_NAME]?.message}
                                    </Typography>
                                ) : undefined
                            }
                            disabled={isDeletedBook}
                        />
                    </Box>
                    <Box>
                        <Typography>Year Published</Typography>
                        <CustomTextField
                            slotProps={{ htmlInput: { 'data-testid': 'year-published-field' } }}
                            type={'number'}
                            fullWidth {...register(YEAR_PUBLISHED_FIELD_NAME)}
                            error={!!formState.errors[YEAR_PUBLISHED_FIELD_NAME]}
                            helperText={
                                areSmallerFieldsStacked ? (
                                    <Typography variant="body1" color="error" component={'span'}>
                                        {formState.errors[YEAR_PUBLISHED_FIELD_NAME]?.message}
                                    </Typography>
                                ) : undefined
                            }
                            disabled={isDeletedBook}
                        />
                    </Box>
                    <Box>
                        <Typography>ISBN</Typography>
                        <CustomTextField
                            slotProps={{ htmlInput: { 'data-testid': 'isbn-field' } }}
                            fullWidth {...register(ISBN_FIELD_NAME)}
                            error={!!formState.errors[ISBN_FIELD_NAME]}
                            helperText={
                                areSmallerFieldsStacked ? (
                                    <Typography variant="body1" color="error" component={'span'}>
                                        {formState.errors[ISBN_FIELD_NAME]?.message}
                                    </Typography>
                                ) : undefined
                            }
                            disabled={isDeletedBook}
                        />
                    </Box>
                </Stack>
                {
                    !areSmallerFieldsStacked && smallFieldsHasErrors ? (
                        <ErrorText
                            isError={true}
                            errorMessage={smallFieldErrorMessage}
                        />
                    ) : undefined
                }
            </Box>
            <Box sx={styles.wrapperBox}>
                <Typography>Authors</Typography>
                <Controller
                    name={AUTHORS_FIELD_NAME}
                    control={form.control}
                    render={({ field }) => (
                        <MultiValueFreeInput
                            id="create-book-authors-input"
                            placeholder="Type and hit enter to add an author"
                            value={field.value ?? []}
                            onChange={field.onChange}
                            disabled={isDeletedBook}
                        />
                    )}
                />
                {
                    formState.errors[AUTHORS_FIELD_NAME] ? (
                        <ErrorText
                            isError={true}
                            errorMessage={formState.errors[AUTHORS_FIELD_NAME]?.message ?? ''}
                        />
                    ) : undefined
                }
            </Box>
            <Box sx={styles.wrapperBox}>
                <Typography>Tags</Typography>
                <Controller
                    name={BOOK_TAGS_FIELD_NAME}
                    control={form.control}
                    render={({ field }) => {
                        return (
                            <BookTagsSelect
                                tags={field.value ?? []}
                                onChange={field.onChange}
                                disabled={isDeletedBook}
                            />
                        );
                    }}
                />
            </Box>
            <Box sx={styles.wrapperBox}>
                <Stack
                    direction={'row'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    gap={`${DEFAULT_GAP}px`}
                >
                    <Button
                        variant='contained'
                        color='primary'
                        type='submit'
                        disabled={hasErrors || isDeletedBook}
                    >
                        {mode === 'create' ? 'Create Book' : 'Update Book'}
                    </Button>
                    {
                        mode === 'update' && onDelete ? (
                            <Button
                                variant='contained'
                                color='error'
                                type='button'
                                onClick={onDelete}
                                disabled={isDeletedBook}
                            >
                                Delete Book
                            </Button>
                        ) : null
                    }
                    {
                        mode === 'update' && onRestore ? (
                            <Button
                                variant='contained'
                                color='primary'
                                type='button'
                                onClick={onRestore}
                                disabled={!isDeletedBook}
                            >
                                Restore Book
                            </Button>
                        ) : null
                    }
                </Stack>
            </Box>
        </Stack>
    );
};

export default BookFormFields;