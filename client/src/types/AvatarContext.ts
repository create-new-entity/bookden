

export type AvatarContextValue = {
    avatarUrl: string;
    setAvatarUrl: React.Dispatch<React.SetStateAction<string>>;
    isPlaceHolderAvatar: boolean;
};