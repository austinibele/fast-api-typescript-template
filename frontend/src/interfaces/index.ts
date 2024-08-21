
import { AlertBannerProps } from '@/components/alert-banner/AlertBanner';

export interface TabProps {
    setMessage: (message: string | null) => void;
    setMessageType: (type: AlertBannerProps['messageType']) => void;
}
