


export type NotificationValue = {
    open: boolean;
    message: string;
    onClose: () => void;
    anchorOrigin: {
        horizontal: 'center',
        vertical: 'top'
    };
    handleShowNotification: (message: string) => void;
};