import { createSqlTag } from 'slonik';

import {
    AvatarTypeAlias, BookCoverTypeAlias, BookTypeAlias,
    PriceRangeTypeAlias, TagTypeAlias, TotalTypeAlias,
    UserBookWishlistTypeAlias, UserTypeAlias, VoidTypeAlias,
    OrderTypeAlias, OrderItemTypeAlias,
    OrderWithItemsTypeAlias
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
        PriceRange: PriceRangeTypeAlias,
        UserBookWishlist: UserBookWishlistTypeAlias,
        Order: OrderTypeAlias,
        OrderItem: OrderItemTypeAlias,
        OrderWithItems: OrderWithItemsTypeAlias
    }
});