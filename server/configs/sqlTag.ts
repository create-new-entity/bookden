import { createSqlTag } from 'slonik';
import { AvatarTypeAlias, TotalTypeAlias, UserTypeAlias } from '../typeAliases';

export const sqlTag = createSqlTag({
    typeAliases: {
        Avatar: AvatarTypeAlias,
        User: UserTypeAlias,
        Total: TotalTypeAlias
    }
});