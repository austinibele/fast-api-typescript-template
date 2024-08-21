import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, Button } from '@mui/material';
import { User } from '@/api/models/User';

import { AlertBannerProps } from '@/components/alert-banner/AlertBanner';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  dialogType: 'edit' | 'create';
  currentUser: User | null;
  handleInputChange: (field: keyof User, value: any) => void;
  setMessage: (message: AlertBannerProps['message']) => void;
  setMessageType: (messageType: AlertBannerProps['messageType']) => void;
}

const UserModal: React.FC<UserModalProps> = ({ open, onClose, onSave, dialogType, currentUser, handleInputChange, setMessage, setMessageType }) => {
  const [errors, setErrors] = useState<{ [key in keyof User]?: string }>({});

  const validateFields = () => {
    const newErrors: { [key in keyof User]?: string } = {};
    if (!currentUser?.should_rebook) newErrors.should_rebook = 'Should rebook is required';
    if (!currentUser?.name) newErrors.name = 'Name is required';
    if (!currentUser?.phone_number) newErrors.phone_number = 'Phone Number is required';
    if (!currentUser?.email) newErrors.email = 'Email is required';
    if (!currentUser?.service_level) newErrors.service_level = 'Service Level is required';
    if (!currentUser?.purchase_date) newErrors.purchase_date = 'Purchase Date is required';
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage('Please fill in all required fields');
      setMessageType('error');
    } else {
      setErrors({});
      setMessage(null);
      setMessageType(undefined);
      onSave();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{dialogType === 'edit' ? 'Edit User' : 'Create User'}</DialogTitle>
      <DialogContent>
      <Select
          label="Should Rebook"
          fullWidth
          margin="none"
          value={currentUser?.should_rebook || ''}
          onChange={(e) => handleInputChange('should_rebook', e.target.value)}
          displayEmpty
          renderValue={(selected) => selected ? selected : 'Select Should Rebook'}
          error={!!errors.should_rebook}
        >
          <MenuItem value=""><em>Select Should Rebook</em></MenuItem>
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={currentUser?.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Phone Number"
          fullWidth
          margin="normal"
          value={currentUser?.phone_number || ''}
          onChange={(e) => handleInputChange('phone_number', e.target.value)}
          disabled={dialogType === 'edit'}
          error={!!errors.phone_number}
          helperText={errors.phone_number}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={currentUser?.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          disabled={dialogType === 'edit'}
          error={!!errors.email}
          helperText={errors.email}
        />
        {errors.location && <p style={{ color: 'red' }}>{errors.location}</p>}
        <Select
          label="Service Level"
          fullWidth
          margin="none"
          value={currentUser?.service_level || ''}
          onChange={(e) => handleInputChange('service_level', e.target.value)}
          displayEmpty
          renderValue={(selected) => selected ? selected : 'Select Service Level'}
          error={!!errors.service_level}
        >
          <MenuItem value=""><em>Select Service Level</em></MenuItem>
          <MenuItem value="basic">Basic</MenuItem>
          <MenuItem value="premium">Premium</MenuItem>
        </Select>
        {errors.service_level && <p style={{ color: 'red' }}>{errors.service_level}</p>}
        <TextField
          label="Purchase Date"
          fullWidth
          margin="normal"
          value={currentUser?.purchase_date || ''}
          onChange={(e) => handleInputChange('purchase_date', e.target.value)}
          disabled={dialogType === 'edit'}
          error={!!errors.purchase_date}
          helperText={errors.purchase_date}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;