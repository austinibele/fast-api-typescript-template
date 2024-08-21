// DraggableUserCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { User } from '@/api/models/User';

import * as utils from '@/utils/index';

const DraggableUserCard = ({ user }: { user: User }) => {
  const backgroundColor = utils.getBotStatusColor(user?.worker ? user.worker?.bot_status : '');

  return (
    <Card style={{ margin: '5px', backgroundColor }}>
      <CardContent style={{ padding: '5px' }}>
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <Typography variant="caption" color="textSecondary">Name</Typography>
            <Typography variant="body2">{user.name}</Typography>
            <Typography variant="caption" color="textSecondary">Email</Typography>
            <Typography variant="body2">{user.email}</Typography>
            <Typography variant="caption" color="textSecondary">Location</Typography>
            <Typography variant="body2">{user.location?.toUpperCase()}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="textSecondary">Initial Appointment</Typography>
            <Typography variant="body2">{user.initial_appointment}</Typography>
            <Typography variant="caption" color="textSecondary">Current Appointment</Typography>
            <Typography variant="body2">{user.current_appointment}</Typography>
            <Typography variant="caption" color="textSecondary">Goal Appointment</Typography>
            <Typography variant="body2">{user.goal_appointment}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DraggableUserCard;