

export type NavOption = {
    name: string,
    text: string,
    action: () => void
};

export interface NavContextValue {
    options: NavOption[],
    setOptions: React.Dispatch<React.SetStateAction<NavOption[]>>,
    showNavDrawer: boolean,
    setShowNavDrawer: React.Dispatch<React.SetStateAction<boolean>>
};