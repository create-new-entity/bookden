
import { Router } from 'express';
import { tokenExtractor } from '../middlewares';
import { asyncHandler } from '../middlewares/asyncHandler';
import { uploadAvatar } from '../middlewares/avatarUpload';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/Authentication';
import { AuthenticationError, BadRequestError } from '../errors/HttpError';
import { errorMessages, errorNames } from '../errors';
import pgDBPoolUtitlities from '../configs/db';
import { sql as slonikSql  } from 'slonik';

const { sql } = pgDBPoolUtitlities.queryVariants;

export const avatarBaseUrl = '/api/avatar';

const avatarRouter = Router();

avatarRouter.put('/', tokenExtractor, uploadAvatar.single('avatar'), asyncHandler(async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    if (!req.user) {
        throw new AuthenticationError();
    }

    if (!req.file) {
        throw new BadRequestError(errorMessages[errorNames.noFileUploaded]);
    }

    const { buffer, mimetype } = req.file;
    const userId = req.user.userId;

    await sql`
        INSERT INTO avatars (user_id, avatar, mime_type)
        VALUES (${userId}, ${slonikSql.binary(buffer)}, ${mimetype})
        ON CONFLICT (user_id)
        DO UPDATE SET
            avatar = EXCLUDED.avatar,
            mime_type = EXCLUDED.mime_type,
            uploaded_at = NOW();
    `;

    res.status(200).end();
    return;
}));

export default avatarRouter;
