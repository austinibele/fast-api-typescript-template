"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import Users from '@/pages/users';
import Machines from '@/pages/machines';
import Performance from '@/pages/performance';
import { Box } from '@mui/material';
import AlertBanner, { AlertBannerProps } from '@/components/alert-banner/AlertBanner';
import * as constants from '@/config/constants';

const tabs = [
  { name: 'users', component: Users },
  { name: 'machines', component: Machines },
  { name: 'performance', component: Performance },
];

const Home: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>('users');
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<AlertBannerProps['messageType']>();

  const SelectedComponent = tabs.find(tab => tab.name === selectedTab)?.component || null;

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        setMessageType(undefined);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);


  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} tabs={tabs} />
      <div style={{ flexGrow: 1, marginLeft: '20px' }}>
        <Box style={{ width: constants.PAGE_WIDTH }}>
          <AlertBanner message={message} messageType={messageType} />
          {SelectedComponent && <SelectedComponent setMessage={setMessage} setMessageType={setMessageType} />}
        </Box>
      </div>
    </div>
  );
};

export default Home;