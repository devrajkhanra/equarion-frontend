import React, { useState, useMemo } from "react";

type Stock = {
    Symbol: string;
    Industry: string;
};

type Props = {
    stocks: Stock[];
    onSelectionChange: (selectedSymbols: string[]) => void;
};

export const StockSelector: React.FC<Props> = ({ stocks, onSelectionChange }) => {
    const [selectedIndustry, setSelectedIndustry] = useState("");
    const [selectedStocks, setSelectedStocks] = useState<string[]>([]);

    const industries = useMemo(() => {
        const setIndustries = new Set(stocks.map((s) => s.Industry));
        return Array.from(setIndustries).sort();
    }, [stocks]);

    const filteredStocks = selectedIndustry
        ? stocks.filter((s) => s.Industry === selectedIndustry)
        : stocks;

    const toggleStock = (symbol: string) => {
        setSelectedStocks((prevSelected) => {
            const newSelected = prevSelected.includes(symbol)
                ? prevSelected.filter((s) => s !== symbol)
                : [...prevSelected, symbol];
            onSelectionChange(newSelected);
            return newSelected;
        });
    };

    const selectAll = () => {
        const allSymbols = filteredStocks.map((s) => s.Symbol);
        setSelectedStocks(allSymbols);
        onSelectionChange(allSymbols);
    };

    const clearAll = () => {
        setSelectedStocks([]);
        onSelectionChange([]);
    };

    return (
        <div style={{ marginTop: 12 }}>
            <label>
                Filter by Industry:{" "}
                <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                >
                    <option value="">All Industries</option>
                    {industries.map((ind) => (
                        <option key={ind} value={ind}>
                            {ind}
                        </option>
                    ))}
                </select>
            </label>
            <div style={{ marginTop: 8 }}>
                <button onClick={selectAll}>Select All</button>{" "}
                <button onClick={clearAll}>Clear All</button>
            </div>
            <ul
                style={{
                    maxHeight: 250,
                    overflowY: "auto",
                    marginTop: 8,
                    paddingLeft: 0,
                    listStyle: "none",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                }}
            >
                {filteredStocks.map((stock) => (
                    <li key={stock.Symbol} style={{ padding: "4px 8px" }}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedStocks.includes(stock.Symbol)}
                                onChange={() => toggleStock(stock.Symbol)}
                            />{" "}
                            {stock.Symbol} ({stock.Industry})
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};
