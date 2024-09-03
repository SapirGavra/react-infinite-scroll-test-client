import React, { useState, useEffect, useRef, UIEvent, MouseEvent, FC } from 'react';
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
import { createSortHandler, sortRows } from './handleSort';
import { handleFilterChange } from './handleFilterChange';
import TruncatedCell from './TruncatedCell';

const BasicTable: FC = () => {
    const rowsLoadFirst = 5;
    const numberRowsToLoad = 2;
    const allRows = airplanesData;
    const [rows, setRows] = useState<Airplane[]>((airplanesData).slice(0, rowsLoadFirst));
    const [currentIndex, setCurrentIndex] = useState(rowsLoadFirst);
    const loadingRef = useRef<boolean>(false);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Airplane; direction: 'asc' | 'desc' } | null>(null);
    const sortLabelRef = useRef<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedKey, setSelectedKey] = useState<keyof Airplane | null>(null);
    const [filterValues, setFilterValues] = useState<{ [key in keyof Airplane]?: Set<string | number> }>({});
    const [isFilterMode, setIsFilterMode] = useState(false);

    useEffect(() => {
        console.log('row:', rows);
    }, [rows]);


    const handleScroll = (event: UIEvent<HTMLDivElement>) => {
        // const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        // if (!loadingRef.current && (scrollHeight - scrollTop <= clientHeight) && currentIndex < airplanesData.length) {
        if (!loadingRef.current && currentIndex < airplanesData.length) {

            console.log('loading1:', loadingRef)
            loadingRef.current = true;
            console.log('loading1:', loadingRef)
            console.log('sortConfig1:',sortConfig)

            setTimeout(() => {
                const newRows = airplanesData.slice(currentIndex, currentIndex + numberRowsToLoad);
                setRows((prevRows) => {
                    const updatedRows = [...prevRows, ...newRows];
                    console.log('sortConfig2:',sortConfig)
                    console.log('sortLabelRef',sortLabelRef)
                    if (sortConfig && !sortLabelRef) {
                        return sortRows(updatedRows, sortConfig?.key, sortConfig?.direction);
                    }
                    return updatedRows;
                });
                setCurrentIndex((prevIndex) => prevIndex + numberRowsToLoad);
                loadingRef.current = false;
                console.log('loading1:', loadingRef)

            }, 500); // Simulate a loading delay
        }
    };

    const handleSort = (key: keyof Airplane) => {
        createSortHandler(key, sortConfig, setSortConfig, rows, setRows, currentIndex, sortLabelRef)();
    };

    const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>, key: keyof Airplane) => {
        setAnchorEl(event.currentTarget);
        setSelectedKey(key);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedKey(null);
    };

    const getRows = () => {
        // If no filters are applied,
        if (!isFilterMode || Object.keys(filterValues).length === 0) {
            return sortConfig ? sortRows(rows, sortConfig.key, sortConfig.direction) : rows;
        }

        // Apply filtering based on isFilterMode
        const filteredRows = allRows.filter((row) => {
            return Object.entries(filterValues).every(([key, values]) => {
                return values.size === 0 || values.has(row[key as keyof Airplane]);
            });
        });

        // Apply sorting after filtering
        return sortConfig ? sortRows(filteredRows, sortConfig.key, sortConfig.direction) : filteredRows;
    };

    return (
        <TableContainer component={Paper} onScroll={handleScroll}>
            <Table sx={{ backgroundColor: '#222220' }} aria-label="simple table">
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
                    {getRows().map((row) => (
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
                            {/*TODO: remove `currentIndex < airplanesData.length`*/}
                            {loadingRef && currentIndex < airplanesData.length && !isFilterMode && <CircularProgress />}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                {selectedKey && Array.from(new Set((airplanesData as Airplane[]).map(item => item[selectedKey])))
                    .sort()
                    .map(value => (
                        <MenuItem key={value}>
                            <Checkbox
                                checked={filterValues[selectedKey]?.has(value) || false}
                                onChange={() => handleFilterChange(selectedKey, value, filterValues, setFilterValues, setIsFilterMode)}
                            />
                            {value}
                        </MenuItem>
                    ))}
            </Menu>
        </TableContainer>
    );
};

export default BasicTable;
