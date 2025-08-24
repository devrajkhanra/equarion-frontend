// src/components/Stock/StockFilters.tsx

import React from "react";
import { BusinessDateRangePicker } from "../BusinessDateRangePicker";
import { StockSelector } from "./StockSelector";

type Props = {
    stocks: { Symbol: string; Industry: string }[];
    onFilterChange: (dates: string[], symbols: string[]) => void;
};

export const StockFilters: React.FC<Props> = ({ stocks, onFilterChange }) => {
    const [selectedDates, setSelectedDates] = React.useState<string[]>([]);
    const [selectedSymbols, setSelectedSymbols] = React.useState<string[]>([]);

    React.useEffect(() => {
        onFilterChange(selectedDates, selectedSymbols);
    }, [selectedDates, selectedSymbols]);

    return (
        <div>
            <BusinessDateRangePicker onChange={setSelectedDates} />
            <StockSelector stocks={stocks} onSelectionChange={setSelectedSymbols} />
        </div>
    );
};
