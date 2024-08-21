// @ts-nocheck

export const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  
export const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);
  
    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
  
    return result;
  };
  
export const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    background: isDragging ? 'lightgreen' : '',
    ...draggableStyle,
  });
  
export const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: 8,
    width: '100%',
    height: 500, // Set a fixed height for all stages
    overflowY: 'auto', // Add scrollbar if content overflows
    display: 'flex',
    flexDirection: 'column',
    marginRight: 8, // Add some space between stages
  });
  
export const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    width: '1270px'
  };
  
