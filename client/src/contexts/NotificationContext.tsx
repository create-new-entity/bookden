import { createContext, useContext, useState, type ReactNode } from 'react';
import type { NotificationValue } from '../types';

const defaultAnchorOrigin: Pick<NotificationValue, 'anchorOrigin'> = { anchorOrigin: { horizontal: 'center', vertical: 'top' }};

const initialValue: NotificationValue = {
    anchorOrigin: defaultAnchorOrigin.anchorOrigin,
    message: '',
    onClose: () => {},
    handleShowNotification: () => {},
    open: false
};

const NotificationContext = createContext(initialValue);

export const NotificationProvider = ({ children }: { children: ReactNode}) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const onClose = () => {
        setOpen(false);
        setMessage('');
    };

    const handleShowNotification= (message: string) => {
        setMessage(message);
        setOpen(true);
    };

    const value: NotificationValue = {
        open,
        message,
        anchorOrigin: defaultAnchorOrigin.anchorOrigin,
        handleShowNotification,
        onClose
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

const useNotificationContext = () => {
    return useContext(NotificationContext);
};

// eslint-disable-next-line react-refresh/only-export-components
export default useNotificationContext;