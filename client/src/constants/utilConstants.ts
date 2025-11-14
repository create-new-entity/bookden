import type { UserType } from '../types';

export const NOTIFICATION_DELAY = 4000;
export const CUSTOMER = 'customer' as const;
export const ADMIN = 'admin' as const;
export const SUPERADMIN = 'superadmin' as const;

export const ALL_TYPES_OF_USERS: UserType[] = [CUSTOMER, ADMIN, SUPERADMIN];

export const PLACE_HOLDER_AVATAR = '/assets/images/avatarPlaceholder.png';