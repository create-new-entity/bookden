import { createSqlTag } from 'slonik';
import { AvatarTypeAlias, UserTypeAlias } from '../typeAliases';

export const sqlTag = createSqlTag({
    typeAliases: {
        Avatar: AvatarTypeAlias,
        User: UserTypeAlias
    }
});