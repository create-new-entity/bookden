import { customColors } from './colors';
import { ADMIN, CUSTOMER, SUPERADMIN } from './utilConstants';


export const LARGE_SVG_ICON_FONT_SIZE = '8rem';
export const PLACE_HOLDER_AVATAR_CARD_MEDIA_WIDTH = '150px';
export const PLACE_HOLDER_AVATAR_CARD_MEDIA_HEIGHT = '150px';
export const BORDER_RADIUS = '20px';

export const USERTYPE_CHIP_COLORS = {
    [CUSTOMER]: customColors.sageGreen,
    [ADMIN]: customColors.darkSecondaryLight,
    [SUPERADMIN]: customColors.lavendarSteel
} as const;

export const DEFAULT_SPACING = 8;