import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from '@material-tailwind/react';
import React from 'react';

interface DeleteModalProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    message?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ open, onClose, onDelete, message }) => {
    return (
        <Dialog open={open} className='h-fit dark:bg-[#060818]' handler={onClose}>
            <DialogHeader>Confirm Delete</DialogHeader>
            <DialogBody>
                <p>{message || 'Are you sure you want to delete this item?'}</p>
            </DialogBody>
            <DialogFooter>
                <Button
                    color="red"
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    color="green"
                    className='ms-2'
                    onClick={onDelete}
                >
                    Delete
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default DeleteModal;
