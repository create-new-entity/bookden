import { Modal } from '@mui/material';
import { forwardRef, useImperativeHandle, useState } from 'react';

export type CustomModalRef = {
    openModal: () => void;
    closeModal: () => void;
};

type CustomModalProps = {
    onClose?: () => void;
    children: React.ReactElement;
};

const CustomModal = forwardRef<CustomModalRef, CustomModalProps>((props, ref) => {
    const { onClose, children } = props;
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => {
        return {
            openModal: () => {
                setIsOpen(true);
            },
            closeModal: () => {
                setIsOpen(false);
            }
        };
    });

    return (
        <Modal
            open={isOpen}
            onClose={() => {
                setIsOpen(false);
                onClose?.();
            }}
        >
            {children}
        </Modal>
    );
});

export default CustomModal;