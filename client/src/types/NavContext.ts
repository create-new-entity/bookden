import type { ReactNode } from 'react';

export type NavOption = {
    name: string;
    component: ReactNode;
    action: () => void;
};

export interface NavContextValue {
    options: NavOption[],
    setOptions: React.Dispatch<React.SetStateAction<NavOption[]>>,
    showNavDrawer: boolean,
    setShowNavDrawer: React.Dispatch<React.SetStateAction<boolean>>
};