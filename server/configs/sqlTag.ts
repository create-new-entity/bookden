import { createSqlTag } from 'slonik';
import { AvatarTypeAlias, UserTypeAlias } from '../types';

export const sqlTag = createSqlTag({
    typeAliases: {
        Avatar: AvatarTypeAlias,
        User: UserTypeAlias
    }
});