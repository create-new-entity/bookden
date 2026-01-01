import { createSqlTag } from 'slonik';

import {
    AvatarTypeAlias, BookCoverTypeAlias, BookTypeAlias,
    PriceRangeTypeAlias,
    TagTypeAlias, TotalTypeAlias, UserTypeAlias,
    VoidTypeAlias
} from '../typeAliases';

export const sqlTag = createSqlTag({
    typeAliases: {
        Avatar: AvatarTypeAlias,
        User: UserTypeAlias,
        Total: TotalTypeAlias,
        Book: BookTypeAlias,
        BookCover: BookCoverTypeAlias,
        Tag: TagTypeAlias,
        Void: VoidTypeAlias,
        PriceRange: PriceRangeTypeAlias
    }
});