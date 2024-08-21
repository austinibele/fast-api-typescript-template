// components/modals/CustomDialog.tsx
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

interface CustomDialogProps {
  open: boolean;
  title: string;
  content: string;
  onClose: () => void;
  onConfirm: () => void;
}

const CustomDialog: React.FC<CustomDialogProps> = ({ open, title, content, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="primary">Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;