import { Airplane } from "../types/Airplane";

type FilterValues = { [key in keyof Airplane]?: Set<string | number> };

export const handleFilterChange = (
    key: keyof Airplane,
    value: string | number,
    filterValues: FilterValues,
    setFilterValues: React.Dispatch<React.SetStateAction<FilterValues>>
) => {
    setFilterValues((prevFilters) => {
        const newFilters = { ...prevFilters };
        if (!newFilters[key]) {
            newFilters[key] = new Set();
        }
        if (newFilters[key]!.has(value)) {
            newFilters[key]!.delete(value);
        } else {
            newFilters[key]!.add(value);
        }
        return newFilters;
    });
};
