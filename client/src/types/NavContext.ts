import type { ReactNode } from 'react';
import type { UserType } from './Users';

export type NavOption = {
    name: string;
    component: ReactNode;
    action: () => void;
    access: UserType[]
};

export interface NavContextValue {
    options: NavOption[],
    setOptions: React.Dispatch<React.SetStateAction<NavOption[]>>,
    showNavDrawer: boolean,
    setShowNavDrawer: React.Dispatch<React.SetStateAction<boolean>>,
    populateLoggedInOptions: () => void,
    populatePublicOptions: () => void
};