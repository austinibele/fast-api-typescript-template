import { Box, Alert } from '@mui/material';

export interface AlertBannerProps {
  message: string | null;
  messageType: 'success' | 'error' | 'info' | 'warning' | undefined;
}

export default function AlertBanner({ message, messageType }: AlertBannerProps) {
  return (
    <>
      <Box className="mt-1 mb-2" style={{height: '50px'}}>
          {message && (
          <Alert severity={messageType}>{message}</Alert>
          )}
      </Box>
    </>
  );
}
