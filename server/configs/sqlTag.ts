import { createSqlTag } from 'slonik';

import { AvatarTypeAlias, BookCoverTypeAlias, BookTypeAlias, TotalTypeAlias, UserTypeAlias } from '../typeAliases';

export const sqlTag = createSqlTag({
    typeAliases: {
        Avatar: AvatarTypeAlias,
        User: UserTypeAlias,
        Total: TotalTypeAlias,
        Book: BookTypeAlias,
        BookCover: BookCoverTypeAlias
    }
});