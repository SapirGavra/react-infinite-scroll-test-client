import { Airplane } from "../types/Airplane";
import React, { Dispatch } from 'react';

type FilterValues = { [key in keyof Airplane]?: Set<string | number> };


export const handleFilterChange = (
    key: keyof Airplane,
    value: string | number,
    filterValues: FilterValues,
    setFilterValues: Dispatch<React.SetStateAction<FilterValues>>,
    setIsFilterMode: Dispatch<React.SetStateAction<boolean>>
) => {
    setFilterValues((prevFilters) => {
        setIsFilterMode(true)
        const newFilters = { ...prevFilters };
        if (!newFilters[key]) {
            newFilters[key] = new Set();
        }
        if (newFilters[key]!.has(value)) {
            newFilters[key]!.delete(value);
            if (newFilters[key]!.size === 0) {
                delete newFilters[key];
            }
        } else {
            newFilters[key]!.add(value);
        }
        
        // Check if the newFilters is empty
        const isFiltersEmpty = Object.keys(newFilters).length === 0;

        // Update filter mode based on whether filters are active
        if (isFiltersEmpty) {
            setIsFilterMode(false);
        } else {
            setIsFilterMode(true);
        }
        return newFilters;

    });
};

