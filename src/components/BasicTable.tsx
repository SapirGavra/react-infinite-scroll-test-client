import React, { useState, useEffect, UIEvent, MouseEvent, FC } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import TableSortLabel from '@mui/material/TableSortLabel';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import airplanesData from '../assets/airplanes.json';
import './BasicTable.css';
import { Airplane } from "../types/Airplane";
import { columns } from "../types/Column";
import { createSortHandler } from './handleSort';
import { handleFilterChange } from './handleFilterChange';
import TruncatedCell from './TruncatedCell';

const BasicTable: FC = () => {
    const rowsLoadFirst = 6;
    const numberRowsToLoad = 4;
    const [allRows, setAllRows] = useState<Airplane[]>([]);
    const [rows, setRows] = useState<Airplane[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Airplane; direction: 'asc' | 'desc' } | null>(null);
    const [sortLabel, setSortLabel] = useState(false); // Sort label state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedKey, setSelectedKey] = useState<keyof Airplane | null>(null);
    const [filterValues, setFilterValues] = useState<{ [key in keyof Airplane]?: Set<string | number> }>({});

    useEffect(() => {
        setAllRows(airplanesData as Airplane[]);
        setRows((airplanesData as Airplane[]).slice(0, rowsLoadFirst));
        setCurrentIndex(rowsLoadFirst);
    }, []);

    const handleScroll = (event: UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 50 && !loading && currentIndex < (airplanesData as Airplane[]).length) {
            setLoading(true);
            setTimeout(() => {
                setRows((prevRows) => [
                    ...prevRows,
                    ...(airplanesData as Airplane[]).slice(currentIndex, currentIndex + numberRowsToLoad)
                ]);
                setCurrentIndex((prevIndex) => prevIndex + numberRowsToLoad);
                setLoading(false);
            }, 500); // Simulate a loading delay
        }
    };

    const handleSort = (key: keyof Airplane) => {
        createSortHandler(key, sortConfig, setSortConfig, allRows, setAllRows, currentIndex, setRows, sortLabel, setSortLabel)();
    };

    const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>, key: keyof Airplane) => {
        setAnchorEl(event.currentTarget);
        setSelectedKey(key);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedKey(null);
    };

    const filteredRows = allRows.filter((row) => {
        return Object.entries(filterValues).every(([key, values]) => {
            return values.size === 0 || values.has(row[key as keyof Airplane]);
        });
    });

    return (
        <TableContainer
            component={Paper}
            onScroll={handleScroll}>
            <Table sx={{ backgroundColor: '#222220'}} aria-label="simple table">
                <TableHead sx={{ backgroundColor: 'black', textAlign: 'center', position: 'sticky', top: 0, zIndex: 1 }}>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.key} sortDirection={sortConfig?.key === column.key ? sortConfig.direction : false}>
                                <TableSortLabel
                                    active={sortConfig?.key === column.key}
                                    direction={sortConfig?.key === column.key ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort(column.key)}
                                >
                                    {column.label}
                                </TableSortLabel>
                                <IconButton onClick={(event) => handleMenuOpen(event, column.key)} size="small">
                                    <MoreVertIcon />
                                </IconButton>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredRows.slice(0, currentIndex).map((row) => (
                        <TableRow key={row.id}>
                            <TableCell sx={{ color: 'white' }} align="center">
                                {row.id}
                            </TableCell>
                            <TruncatedCell text={row.type} maxLength={10} />
                            <TableCell sx={{ color: 'white' }} align="center">{row.capacity}</TableCell>
                            <TableCell sx={{ color: 'white' }} align="center">{row.size}</TableCell>

                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={4} align="center">
                            {loading && <CircularProgress />}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {selectedKey && Array.from(new Set((airplanesData as Airplane[]).map(item => item[selectedKey])))
                    .sort()
                    .map(value => (
                        <MenuItem  key={value}>
                            <Checkbox
                                checked={filterValues[selectedKey]?.has(value) || false}
                                onChange={() => handleFilterChange(selectedKey, value, filterValues, setFilterValues)}
                            />
                            {value}
                        </MenuItem>
                    ))}
            </Menu>

        </TableContainer>
    );
};

export default BasicTable;
