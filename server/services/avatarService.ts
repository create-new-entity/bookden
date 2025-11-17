import { getPGDBPool } from '../configs/db';
import { sqlTag } from '../configs/sqlTag';

const saveAvatar = async (userId: number, buffer: Buffer, mimetype: string) => {
    const dbPool = await getPGDBPool();

    return await dbPool.query(sqlTag.typeAlias('Avatar')`
        INSERT INTO avatars (user_id, avatar, mime_type)
        VALUES (${userId}, ${sqlTag.binary(buffer)}, ${mimetype})
        ON CONFLICT (user_id)
        DO UPDATE SET
            avatar = EXCLUDED.avatar,
            mime_type = EXCLUDED.mime_type,
            uploaded_at = NOW();
    `);
};

const getAvatar = async (userId: number) => {
    const dbPool = await getPGDBPool();

    return await dbPool.query(sqlTag.typeAlias('Avatar')`
        SELECT
            a.avatar_id,
            a.avatar,
            a.user_id,
            a.mime_type
        FROM avatars a
        WHERE a.user_id = ${userId};
    `);
};

const deleteAvatar = async (userId: number) => {
    const dbPool = await getPGDBPool();

    return await dbPool.query(sqlTag.typeAlias('Avatar')`
        DELETE
        FROM avatars
        WHERE user_id = ${userId};
    `);
};


export {
    saveAvatar,
    getAvatar,
    deleteAvatar
};