import { sql as slonikSql } from 'slonik';
import pgDBPoolUtitlities from '../configs/db';

const { sql, sqlMayBeOne } = pgDBPoolUtitlities.queryVariants;

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

const getAvatar = async (userId: string) => {
    return await pgDBPoolUtitlities.getPGDBPool()?.one(slonikSql.unsafe`
        SELECT
            a.avatar_id,
            a.avatar,
            a.user_id,
            a.mime_type
        FROM avatars a
        WHERE a.user_id = ${userId};
    `);
};


export {
    saveAvatar,
    getAvatar
};