

export const MARGIN_TOP_TO_AVOID_NAV_BAR = '4rem';
export const VERTICALLY_AVAILABLE_HEIGHT_WITHOUT_NAV_BAR = `calc(90vh - ${MARGIN_TOP_TO_AVOID_NAV_BAR})`;
export const CONTENT_MARGIN = '1rem';
export const MINIMUM_WIDTH_FOR_SELECT_USER_TYPE = '8rem';
export const MINIMUM_WIDTH_FOR_USERS_SELECT_SORT_BY = '13rem';
export const MINIMUM_WIDTH_FOR_BOOKS_SELECT_SORT_BY = '13rem';
export const MINIMUM_WIDTH_FOR_SELECT_SORT_ORDER = '9rem';
export const STACK_DEFAULT_GAP = '1rem';
export const NAV_BAR_Z_INDEX = 1000;
export const DEFAULT_GAP = 20;
export const DEFAULT_BORDER_RADIUS = '0.5rem';
export const ITEMS_GRID_SIZES = { xs: 12, md: 6, lg: 3 };
export const LIST_VIEW_GRID_SIZES = { xs: 11 };
export const AVATAR_DIMENSIONS = 145;
export const ONE_TENTH_OF_DEFAULT_GAP = DEFAULT_GAP / 10;



/*
    Note to future self:
    Let's go for aspect ratio 2 / 3 for width / height.
*/
const BOOK_COVER_ASPECT_RATIO = 2 / 3;
export const BOOK_COVER_WIDTH = 220;
export const BOOK_COVER_HEIGHT = BOOK_COVER_WIDTH / BOOK_COVER_ASPECT_RATIO;