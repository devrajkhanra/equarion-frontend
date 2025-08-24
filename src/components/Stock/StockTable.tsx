import React from "react";

type StockData = {
    SYMBOL: string;
    DATE1: string;
    SERIES: string;
    OPEN_PRICE: string;
    HIGH_PRICE: string;
    LOW_PRICE: string;
    CLOSE_PRICE: string;
    TTL_TRD_QNTY: string;
    DELIV_QTY: string;
    DELIV_PER: string;
};

export const StockTable: React.FC<{ data?: StockData[] }> = ({ data }) => {
    if (!data || data.length === 0) return <p>No stock data matching criteria.</p>;

    return (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
            <thead>
                <tr>
                    {[
                        "Symbol",
                        "Date",
                        "Series",
                        "Open",
                        "High",
                        "Low",
                        "Close",
                        "Qty Traded",
                        "Delivery Qty",
                        "Delivery %",
                    ].map((header) => (
                        <th key={header} style={{ border: "1px solid #ccc", padding: 8 }}>
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, idx) => (
                    <tr key={`${row.SYMBOL}-${idx}`}>
                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.SYMBOL}</td>
                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.DATE1.trim()}</td>
                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.SERIES.trim()}</td>
                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.OPEN_PRICE.trim()}</td>
                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.HIGH_PRICE.trim()}</td>
                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.LOW_PRICE.trim()}</td>
                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.CLOSE_PRICE.trim()}</td>
                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.TTL_TRD_QNTY.trim()}</td>
                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.DELIV_QTY.trim()}</td>
                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.DELIV_PER.trim()}%</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
