import React, { ReactNode, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, IconButton, Select, MenuItem, FormControl, InputLabel, Box, Button, SelectChangeEvent } from '@mui/material';
import { ExpandMore, Close, ArrowLeft, ArrowRight } from '@mui/icons-material';

import * as utils from '@/utils/index';

interface CustomTableProps<T> {
  data: T[];
  columns: { label: string, key: keyof T }[];
  selectedRows: string[];
  onCheckboxChange: (id: string[]) => void;
  getRowId: (row: T) => string;
}

const valueToReactNode = (value: any): ReactNode => {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};


const CustomTable = <T extends {}>({ data, columns, selectedRows, onCheckboxChange, getRowId }: CustomTableProps<T>) => {
  const [expanded, setExpanded] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => getRowId(n));
      onCheckboxChange(newSelecteds);
      return;
    }
    onCheckboxChange([]);
  };

  const handleClick = (id: string) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      );
    }

    onCheckboxChange(newSelected);
  };

  const handleExpandCollapse = () => {
    setExpanded(!expanded);
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(event.target.value as number);
    setPage(0);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, Math.ceil(data.length / rowsPerPage) - 1));
  };

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <TableContainer component={Paper} style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                  checked={data.length > 0 && selectedRows.length === data.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              {columns.map((column, index) => (
                <TableCell key={index}>{column.label}</TableCell>
              ))}
              <TableCell>
                <IconButton onClick={handleExpandCollapse}>
                  {expanded ? <Close /> : <ExpandMore />}
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          {expanded && (
            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.includes(getRowId(row))}
                      onChange={() => handleClick(getRowId(row))}
                    />
                  </TableCell>
                  {columns.map((column, colIndex) => (
                    <TableCell 
                      key={colIndex} 
                      style={column.key === 'worker|bot_status' ? { color: utils.getBotStatusColorDark(utils.getNestedValue(row, column.key as string)), fontWeight: 1000 } : {}}
                    >
                      {(!(column.key as string).includes('|')) ? valueToReactNode(row[column.key]) : valueToReactNode(utils.getNestedValue(row, column.key as string))}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {expanded && (
        <Box display="flex" justifyContent="end" gap={3} alignItems="center" padding={2}>
          <FormControl variant="outlined" size="small" style={{ width: '110px' }}>
            <InputLabel>Rows per page</InputLabel>
            <Select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              label="Rows per page"
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
          <Box display="flex" alignItems="center">
            <Button onClick={handlePreviousPage} disabled={page === 0}>
              <ArrowLeft />
            </Button>
            <Box mx={2}>{page + 1}</Box>
            <Button onClick={handleNextPage} disabled={page >= Math.ceil(data.length / rowsPerPage) - 1}>
              <ArrowRight />
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CustomTable;