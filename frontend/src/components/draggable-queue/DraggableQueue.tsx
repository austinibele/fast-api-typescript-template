// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { ExpandMore, Close } from '@mui/icons-material';
import { reorder, move, getItemStyle, getListStyle, containerStyle } from './helpers';
import DraggableUserCard from './DraggableUserCard';

const DraggableQueue = ({ users, onUserStatusChange, isDraggable=true }) => {
  const [state, setState] = useState({
    waiting: users.filter(user => user.queue_position === 'waiting'),
    in_progress: users.filter(user => user.queue_position === 'in_progress'),
    finished: users.filter(user => user.queue_position === 'finished'),
  });

  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    setState({
      waiting: users.filter(user => user.queue_position === 'waiting'),
      in_progress: users.filter(user => user.queue_position === 'in_progress'),
      finished: users.filter(user => user.queue_position === 'finished'),
    });
  }, [users]);

  const onDragEnd = result => {
    if (!isDraggable) return;

    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        state[source.droppableId],
        source.index,
        destination.index
      );
      setState(prevState => ({
        ...prevState,
        [source.droppableId]: items,
      }));
    } else {
      const result = move(
        state[source.droppableId],
        state[destination.droppableId],
        source,
        destination
      );
      setState(prevState => ({
        ...prevState,
        [source.droppableId]: result[source.droppableId],
        [destination.droppableId]: result[destination.droppableId],
      }));

      // Update the user's status
      const movedUser = result[destination.droppableId][destination.index];
      onUserStatusChange(movedUser, destination.droppableId);
    }
  };

  const handleExpandCollapse = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="d-flex mt-2 justify-content-center">
      <div style={{ position: 'relative', border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
          <Typography variant="h6">Scheduling Queue</Typography>
          <IconButton onClick={handleExpandCollapse}>
            {expanded ? <Close /> : <ExpandMore />}
          </IconButton>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={containerStyle}>
            {expanded && (
              <div style={containerStyle}>
                {['waiting', 'in_progress', 'finished'].map(stage => (
                  <Droppable key={stage} droppableId={stage} isDropDisabled={!isDraggable}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                        {...provided.droppableProps}
                      >
                        <h3>{stage.replace('_', ' ').toUpperCase()}</h3>
                        {state[stage].map((user, index) => (
                          <Draggable key={user.email} draggableId={user.email} index={index} isDragDisabled={!isDraggable}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                <DraggableUserCard user={user} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            )}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default DraggableQueue;