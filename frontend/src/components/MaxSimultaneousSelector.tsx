// components/MaxSimultaneousSelector.tsx
import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, CircularProgress } from '@mui/material';
import { SettingsService } from '@/api';
import { Settings } from '@/api/models/Settings';
import CustomDialog from './modals/CustomDialog'; // Import the CustomDialog component

interface MaxSimultaneousSelectorProps {
  setMessage: (message: string) => void;
  setMessageType: (type: 'success' | 'error') => void;
}

const MaxSimultaneousSelector: React.FC<MaxSimultaneousSelectorProps> = ({ setMessage, setMessageType }) => {
  const [maxSimultaneous, setMaxSimultaneous] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [newMaxSimultaneous, setNewMaxSimultaneous] = useState<number | null>(null);

  useEffect(() => {
    // Fetch initial settings
    SettingsService.getSettings()
      .then((response: Settings) => {
        setMaxSimultaneous(response.max_simultaneous_bookings || 1);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch settings:', error);
        setMessage('Failed to fetch settings.');
        setMessageType('error');
        setLoading(false);
      });
  }, [setMessage, setMessageType]);

  const handleMaxSimultaneousChange = (event: SelectChangeEvent<number>) => {
    const newValue = event.target.value as number;
    setNewMaxSimultaneous(newValue);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewMaxSimultaneous(null);
  };

  const handleDialogConfirm = () => {
    if (newMaxSimultaneous !== null) {
      setMaxSimultaneous(newMaxSimultaneous);

      // Update settings in the backend
      SettingsService.updateSettings({ max_simultaneous_bookings: newMaxSimultaneous })
        .then(() => {
          setMessage('Settings updated successfully.');
          setMessageType('success');
        })
        .catch((error) => {
          console.error('Failed to update settings:', error);
          setMessage('Failed to update settings.');
          setMessageType('error');
        });
    }
    setDialogOpen(false);
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <FormControl variant="outlined" size="small" style={{ width: '130px' }}>
          <InputLabel id="max-simultaneous-label">Max Simultaneous</InputLabel>
          <Select
            labelId="max-simultaneous-label"
            value={maxSimultaneous}
            onChange={handleMaxSimultaneousChange}
            label="Max Simultaneous"
          >
            {[...Array(10).keys()].map(value => (
              <MenuItem key={value + 1} value={value + 1}>{value + 1}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <CustomDialog
        open={dialogOpen}
        title="Confirm Change"
        content={`Are you sure you want to change the Max Simultaneous value to ${newMaxSimultaneous}?`}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
      />
    </>
  );
};

export default MaxSimultaneousSelector;