import React from 'react';
import { Drawer } from '@mui/material';
import { Row, Col } from 'react-bootstrap';
import styles from './Sidebar.module.css';

import { TabProps } from '@/interfaces/index';

interface SidebarProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  tabs: { name: string, component: React.FC<TabProps> }[];
}

const Sidebar: React.FC<SidebarProps> = ({ selectedTab, setSelectedTab, tabs }) => {

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <Drawer variant="permanent" className="bg-light" style={{ width: '120px' }}>
      <Col style={{ width: '120px' }} className="p-3">
        {tabs.map(tab => (
          <Row key={tab.name} className="mb-2" onClick={() => handleTabClick(tab.name)}>
            <div className={`${styles.link} ${selectedTab === tab.name ? styles.active : ''}`}>
              {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
            </div>
          </Row>
        ))}
      </Col>
    </Drawer>
  );
};

export default Sidebar;