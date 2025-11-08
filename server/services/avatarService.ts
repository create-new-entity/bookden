import { sql as slonikSql } from 'slonik';
import pgDBPoolUtitlities from '../configs/db';

const { sql } = pgDBPoolUtitlities.queryVariants;

const saveAvatar = async (userId: string, buffer: Buffer, mimetype: string) => {
    return await sql`
        INSERT INTO avatars (user_id, avatar, mime_type)
        VALUES (${userId}, ${slonikSql.binary(buffer)}, ${mimetype})
        ON CONFLICT (user_id)
        DO UPDATE SET
            avatar = EXCLUDED.avatar,
            mime_type = EXCLUDED.mime_type,
            uploaded_at = NOW();
    `;
};


export {
    saveAvatar
};