import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';

interface ActionsMenuProps {
  anchorEl: HTMLElement | null;
  handleActionsClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleActionsClose: () => void;
  actions: { label: string, onClick: () => void }[];
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({ anchorEl, handleActionsClick, handleActionsClose, actions }) => {
  return (
    <>
      <Button variant="contained" onClick={handleActionsClick}>Actions</Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleActionsClose}>
        {actions.map((action, index) => (
          <MenuItem key={index} onClick={action.onClick}>{action.label}</MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ActionsMenu;