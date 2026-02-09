const UNAUTHORIZED = 'Unauthorized' as const;
const USER_NOT_FOUND = 'UserNotFound' as const;
const RESOURCE_NOT_FOUND = 'ResourceNotFound' as const;
const BAD_REQUEST = 'BadRequest' as const;
const LOGIN_REQUIRED = 'LoginRequired' as const;
const INVALID_PASSWORD = 'InvalidPassword' as const;
const TOKEN_EXPIRED = 'TokenExpired' as const;
const TOKEN_INVALID = 'TokenInvalid' as const;
const ENV_VAR_NOT_DEFINED = 'EnvVariableNotDefined' as const;
const RESOURCE_CONFLICT = 'ResourceConflict' as const;
const INTERNAL_SERVER_ERROR = 'InternalServerError' as const;
const VALIDATION_FAILED = 'ValidationFailed' as const;
const UNSUPPORTED_AVATAR_EXTENSION = 'UnsupportedAvatarExtension' as const;
const NO_FILE_UPLOADED = 'NoFileUploaded' as const;
const AVATAR_NOT_FOUND = 'AvatarNotFound' as const;
const INVALID_AUTH_HEADER = 'InvalidAuthHeader' as const;
const INVALID_BOOK_ID = 'InvalidBookId' as const;
const NO_COVER_IMAGE_UPLOADED = 'NoCoverImageUploaded' as const;
const BOOK_COVER_NOT_FOUND = 'BookCoverNotFound' as const;
const INVALID_BOOK_TAGS = 'InvalidBookTags' as const;
const IMAGE_TOO_LARGE = 'ImageTooLarge' as const;
const INVALID_FILE_UPLOAD = 'InvalidFileUpload' as const;

export const errorNames = {
    unauthorized: UNAUTHORIZED,
    userNotFound: USER_NOT_FOUND,
    resourceNotFound: RESOURCE_NOT_FOUND,
    badRequest: BAD_REQUEST,
    loginRequired: LOGIN_REQUIRED,
    invalidPassword: INVALID_PASSWORD,
    tokenExpired: TOKEN_EXPIRED,
    tokenInvalid: TOKEN_INVALID,
    envVarUndefined: ENV_VAR_NOT_DEFINED,
    resourceConflict: RESOURCE_CONFLICT,
    internalServerError: INTERNAL_SERVER_ERROR,
    validationFailed: VALIDATION_FAILED,
    unsupportedAvatarExtension: UNSUPPORTED_AVATAR_EXTENSION,
    noFileUploaded: NO_FILE_UPLOADED,
    avatarNotFound: AVATAR_NOT_FOUND,
    invalidAuthHeader: INVALID_AUTH_HEADER,
    invalidBookId: INVALID_BOOK_ID,
    noCoverImageUploaded: NO_COVER_IMAGE_UPLOADED,
    bookCoverNotFound: BOOK_COVER_NOT_FOUND,
    invalidBookTags: INVALID_BOOK_TAGS,
    imageTooLarge: IMAGE_TOO_LARGE,
    invalidFileUpload: INVALID_FILE_UPLOAD
};

export const errorMessages = {
    [UNAUTHORIZED]: 'You are not authorized to perform this action',
    [USER_NOT_FOUND]: 'User not found',
    [RESOURCE_NOT_FOUND]: 'Resource not found',
    [BAD_REQUEST]: 'Bad request',
    [LOGIN_REQUIRED]: 'You must be logged in to perform this action',
    [INVALID_PASSWORD]: 'Invalid password',
    [TOKEN_EXPIRED]: 'Authentication token has expired',
    [TOKEN_INVALID]: 'Authentication token is invalid',
    [ENV_VAR_NOT_DEFINED]: 'Some env variable is not defined',
    [RESOURCE_CONFLICT]: 'Resource conflicts with existing resource ( duplicate and so on )',
    [INTERNAL_SERVER_ERROR]: 'Internal server error',
    [VALIDATION_FAILED]: 'Validation failed',
    [UNSUPPORTED_AVATAR_EXTENSION]: 'Only JPEG, PNG, and WebP are allowed',
    [NO_FILE_UPLOADED]: 'No file uploaded',
    [AVATAR_NOT_FOUND]: 'Avatar not found',
    [INVALID_AUTH_HEADER]: 'Invalid Authorization header format',
    [INVALID_BOOK_ID]: 'Invalid book ID',
    [NO_COVER_IMAGE_UPLOADED]: 'No cover image uploaded',
    [BOOK_COVER_NOT_FOUND]: 'Book cover not found',
    [INVALID_BOOK_TAGS]: 'One or more booktags are invalid',
    [IMAGE_TOO_LARGE]: 'Image is too large. Maximum allowed size is 3MB.',
    [INVALID_FILE_UPLOAD]: 'Invalid file upload'
};

const AVATAR_UPLOAD_SUCCESS = 'AvatarUploadSuccess' as const;

export const successNames = {
    avatarUploadSuccess: AVATAR_UPLOAD_SUCCESS
};

export const successMessages = {
    [AVATAR_UPLOAD_SUCCESS]: 'Avatar uploaded successfully'
};