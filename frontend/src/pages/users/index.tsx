import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import UserModal from '@/components/modals/UserModal';
import CustomTable from '@/components/CustomTable';
import { User } from '@/api/models/User';
import { UserService } from '@/api';
import { useDataManagement } from '@/hooks/useDataManagement';
import ActionsMenu from '@/components/ActionsMenu';
import DraggableQueue from '@/components/draggable-queue/DraggableQueue';
import { TabProps } from '@/interfaces/index';
import * as utils from '@/utils/index';
import MaxSimultaneousSelector from '@/components/MaxSimultaneousSelector';

import * as constants from '@/config/constants';

const Users: React.FC<TabProps> = ({ setMessage, setMessageType }) => {
  const { data: users, selectedRows, handleCheckboxChange, handleRefresh, setData: setUsers } = useDataManagement<User>(UserService.getUsers);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'edit' | 'create'>('edit');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleRefresh();
    }, constants.REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [handleRefresh]);

  const handleActionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionsClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteUser = () => {
    selectedRows.forEach(email => {
      UserService.deleteUser(email)
        .then(() => {
          setUsers(prevUsers => prevUsers.filter(user => user.email !== email));
          setMessage('User deleted successfully.');
          setMessageType('success');
        })
        .catch(error => {
          console.error(`Failed to delete user ${email}:`, error);
          setMessage(`Failed to delete user ${email}.`);
          setMessageType('error');
        });
    });
    handleActionsClose();
  };

  const handleEditUser = () => {
    if (selectedRows.length === 1) {
      const userToEdit = users.find(user => user.email === selectedRows[0]);
      if (userToEdit) {
        setCurrentUser(userToEdit);
        setDialogType('edit');
        setDialogOpen(true);
      }
    } else {
      alert('Please select exactly one user to edit.');
    }
  };

  const handleNewUser = () => {
    setCurrentUser({} as User); // Initialize currentUser as an empty User object
    setDialogType('create');
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const reloadUserData = () => {
    setTimeout(() => {
      handleRefresh();
    }, constants.REFRESH_INTERVAL_FAST);
  };

  const handleDialogSave = () => {
    if (dialogType === 'edit' && currentUser) {
      // add last_modified datetime to User object
      currentUser.last_modified = utils.currentFormattedDateTime();
      UserService.updateUser(currentUser)
        .then(updatedUser => {
          setUsers(prevUsers => prevUsers.map(user => user.email === updatedUser.email ? updatedUser : user));
          setDialogOpen(false);
          setMessage('User updated successfully.');
          setMessageType('success');
          reloadUserData();
        })
        .catch(error => {
          console.error('Failed to update user:', error);
          setDialogOpen(false);
          setMessage('Failed to update user.');
          setMessageType('error');
        });
    } else if (dialogType === 'create' && currentUser) {
      // add created_at datetime to User object
      currentUser.created_at = utils.currentFormattedDateTime();
      currentUser.last_modified = utils.currentFormattedDateTime();
      currentUser.queue_position = User.queue_position.WAITING;
      currentUser.worker = null;
      UserService.createUser(currentUser)
        .then(newUser => {
          setUsers(prevUsers => [...prevUsers, currentUser]);
          setDialogOpen(false);
          setMessage('User created successfully.');
          setMessageType('success');
          reloadUserData(); // Reload user data after 10 seconds
        })
        .catch(error => {
          console.error('Failed to create user:', error);
          setDialogOpen(false);
          setMessage('Failed to create user.');
          setMessageType('error');
        });
    }
  };

  const handleInputChange = (field: keyof User, value: any) => {
    setCurrentUser(prevUser => prevUser ? { ...prevUser, [field]: value } : { [field]: value } as User);
  };

  const handleUserStatusChange = async (user: User, newStatus: string) => {
    user.queue_position = newStatus as User.queue_position;
    try {
      const updatedUser = await UserService.updateUser(user);
      setUsers(prevUsers => prevUsers.map(u => u.email === updatedUser.email ? updatedUser : u));
      setMessage(`User ${user.email} status updated successfully.`);
      setMessageType('success');
      reloadUserData(); // Reload user data after 10 seconds
    } catch (error) {
      console.error(`Failed to update user ${user.email}:`, error);
      setMessage(`Failed to update user ${user.email}.`);
      setMessageType('error');
    }
  };

  const handleStartServer = async () => {
    selectedRows.forEach(email => {
      const user = users.find(u => u.email === email);
      if (user) {
        UserService.startServer(user)
          .then(() => {
            setMessage(`Servers started for user ${user.email}.`);
            setMessageType('success');
            reloadUserData(); // Reload user data after 10 seconds
          })
          .catch(error => {
            console.error(`Failed to start servers for user ${user.email}:`, error);
            setMessage(`Failed to start servers for user ${user.email}.`);
            setMessageType('error');
          });
      }
    });
  }

  const handleStopServer = async () => {
    selectedRows.forEach(email => {
      const user = users.find(u => u.email === email);
      if (user) {
        UserService.stopServer(user)
          .then(() => {
            setMessage(`Servers stopped for user ${user.email}.`);
            setMessageType('success');
            reloadUserData(); // Reload user data after 10 seconds
          })
          .catch(error => {
            console.error(`Failed to stop servers for user ${user.email}:`, error);
            setMessage(`Failed to stop servers for user ${user.email}.`);
            setMessageType('error');
          });
      }
    });
  }

  const handleRefreshServerStatus = async () => {
    selectedRows.forEach(email => {
      const user = users.find(u => u.email === email);
      if (user) {
        UserService.serverStatus(user)
          .then(() => {
            setMessage(`Server status refreshed for user ${user.email}.`);
            setMessageType('success');
            reloadUserData(); // Reload user data after 10 seconds
          })
          .catch(error => {
            console.error(`Failed to refresh server status for user ${user.email}:`, error);
            setMessage(`Failed to refresh server status for user ${user.email}.`);
            setMessageType('error');
          });
      }
    });
  }

  const handleStartRebooking = async () => {
    selectedRows.forEach(email => {
      const user = users.find(u => u.email === email);
      if (user) {
        UserService.startRebooking(user)
          .then(() => {
            setMessage(`Rebooking started for user ${user.email}.`);
            setMessageType('success');
            reloadUserData(); // Reload user data after 10 seconds
          })
          .catch(error => {
            console.error(`Failed to start rebooking for user ${user.email}:`, error);
            setMessage(`Failed to start rebooking for user ${user.email}.`);
            setMessageType('error');
          });
      }
    });
  }

  const handleAssignWorker = async () => {
    selectedRows.forEach(email => {
      const user = users.find(u => u.email === email);
      if (user) {
        UserService.assignWorker(user)
        .then(() => {
          setMessage(`Worker assigned to user ${user.email} successfully.`);
          setMessageType('success');
          reloadUserData(); // Reload user data after 10 seconds
        })
        .catch(error => {
          console.error(`Failed to assign worker to user ${user.email}:`, error);
          setMessage(`Failed to assign worker to user ${user.email}.`);
          setMessageType('error');
        });
      }
    });
  }

  const handleRemoveWorker = async () => {
    selectedRows.forEach(email => {
      const user = users.find(u => u.email === email);
      if (user) {
        user.worker = null;
        UserService.updateUser(user)
          .then(updatedUser => {
            setUsers(prevUsers => prevUsers.map(u => u.email === updatedUser.email ? updatedUser : u));
            setMessage(`Worker removed from user ${user.email} successfully.`);
            setMessageType('success');
            reloadUserData(); // Reload user data after 10 seconds
          })
          .catch(error => {
            console.error(`Failed to remove worker from user ${user.email}:`, error);
            setMessage(`Failed to remove worker from user ${user.email}.`);
            setMessageType('error');
          });
      }
    });
  }

  const columns = [
    { label: 'Email', key: 'email' as keyof User },
    { label: 'Queue Position', key: 'queue_position' as keyof User },
    { label: 'Bot Status', key: 'worker|bot_status' as keyof User },
    { label: 'Should Rebook', key: 'should_rebook' as keyof User },
    { label: 'Host', key: 'worker|host' as keyof User },
    { label: 'Name', key: 'name' as keyof User },
    { label: 'Location', key: 'location' as keyof User },
    { label: 'Service Level', key: 'service_level' as keyof User },
    { label: 'Initial Date', key: 'initial_appointment' as keyof User },
    { label: 'Current Date', key: 'current_appointment' as keyof User },
    { label: 'Goal Date', key: 'goal_appointment' as keyof User },
    { label: 'Created At', key: 'created_at' as keyof User },
    // { label: 'Last Modified', key: 'last_modified' as keyof User },
    // { label: 'Machine ID', key: 'machine_id' as keyof User },
  ];

  const actions = [
    { label: 'Delete User', onClick: handleDeleteUser },
    { label: 'Assign Worker', onClick: handleAssignWorker },
    { label: 'Remove Worker', onClick: handleRemoveWorker },
    { label: 'Start Server', onClick: handleStartServer },
    { label: 'Stop Server', onClick: handleStopServer },
    { label: 'Refresh Server Status', onClick: handleRefreshServerStatus },
    { label: 'Start Rebooking', onClick: handleStartRebooking },
  ];

  return (
    <>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="contained" onClick={handleRefresh}>Refresh</Button>
        <Box style={{ paddingLeft: '400px' }}>
          <MaxSimultaneousSelector setMessage={setMessage} setMessageType={setMessageType} />
        </Box>
        <Box display="flex" alignItems="center">
          <ActionsMenu
            anchorEl={anchorEl}
            handleActionsClick={handleActionsClick}
            handleActionsClose={handleActionsClose}
            actions={actions}
          />
          <Button variant="contained" onClick={handleEditUser} style={{ marginLeft: '10px' }}>Edit User</Button>
          <Button variant="contained" onClick={handleNewUser} style={{ marginLeft: '10px' }}>New User</Button>
        </Box>
      </Box>
      <CustomTable
        data={users}
        columns={columns}
        selectedRows={selectedRows}
        onCheckboxChange={handleCheckboxChange}
        getRowId={(user) => user.email}
      />
      <UserModal
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        dialogType={dialogType}
        currentUser={currentUser}
        handleInputChange={handleInputChange}
        setMessage={setMessage}
        setMessageType={setMessageType}
      />
      <DraggableQueue users={users} onUserStatusChange={handleUserStatusChange} />
    </>
  );
};

export default Users;