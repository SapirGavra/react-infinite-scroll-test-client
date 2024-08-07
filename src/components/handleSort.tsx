import { Airplane } from "../types/Airplane";

interface SortConfig {
    key: keyof Airplane;
    direction: 'asc' | 'desc';
}

export const createSortHandler = (
    key: keyof Airplane,
    sortConfig: SortConfig | null,
    setSortConfig: (config: SortConfig) => void,
    allRows: Airplane[],
    setAllRows: (rows: Airplane[]) => void,
    currentIndex: number,
    setRows: (rows: Airplane[]) => void,
    sortLabel: boolean,
    setSortLabel: (value: boolean) => void
) => () => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
    }
    setSortConfig({ key, direction });

    if (!sortLabel) {
        setSortLabel(true);
        const sortedRows = [...allRows].sort((a, b) => {
            if (a[key] > b[key]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key] < b[key]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        setAllRows(sortedRows);
        setRows(sortedRows.slice(0, currentIndex));
        setSortLabel(false);
    }
};
