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

export const StockTable: React.FC<{ 
    data?: StockData[]; 
    volumeBreakouts?: any[];
    deliveryBreakouts?: any[];
}> = ({ data, volumeBreakouts = [], deliveryBreakouts = [] }) => {
    if (!data || data.length === 0) {
        return (
            <div className="apollo-loading">
                <p>No stock data matching criteria.</p>
            </div>
        );
    }

    // Create lookup maps for breakout data
    const volumeBreakoutMap = volumeBreakouts.reduce((acc, item) => {
        acc[item.symbol] = item;
        return acc;
    }, {} as Record<string, any>);

    const deliveryBreakoutMap = deliveryBreakouts.reduce((acc, item) => {
        acc[item.symbol] = item;
        return acc;
    }, {} as Record<string, any>);

    return (
        <div className="apollo-card">
            <div className="apollo-card-header">
                <h3 className="apollo-heading-3">Stock Data</h3>
                <p className="apollo-text-muted" style={{ margin: 0, fontSize: 'var(--apollo-font-size-sm)' }}>
                    {data.length} records found
                </p>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table className="apollo-table">
            <thead>
                <tr>
                        <th>Symbol</th>
                        <th>Date</th>
                        <th>Series</th>
                        <th>Open</th>
                        <th>High</th>
                        <th>Low</th>
                        <th>Close</th>
                        <th>Volume</th>
                        <th>Delivery Qty</th>
                        <th>Delivery %</th>
                        {volumeBreakouts.length > 0 && <th>Vol Ratio</th>}
                        {deliveryBreakouts.length > 0 && <th>Del Ratio</th>}
                </tr>
            </thead>
            <tbody>
                {data.map((row, idx) => (
                        <tr key={`${row.SYMBOL}-${idx}`}>
                            <td style={{ fontWeight: '600' }}>{row.SYMBOL}</td>
                            <td>{row.DATE1.trim()}</td>
                            <td>{row.SERIES.trim()}</td>
                            <td>₹{parseFloat(row.OPEN_PRICE.trim()).toLocaleString()}</td>
                            <td>₹{parseFloat(row.HIGH_PRICE.trim()).toLocaleString()}</td>
                            <td>₹{parseFloat(row.LOW_PRICE.trim()).toLocaleString()}</td>
                            <td>₹{parseFloat(row.CLOSE_PRICE.trim()).toLocaleString()}</td>
                            <td>{parseInt(row.TTL_TRD_QNTY.trim()).toLocaleString()}</td>
                            <td>{parseInt(row.DELIV_QTY.trim()).toLocaleString()}</td>
                            <td>{row.DELIV_PER.trim()}%</td>
                            {volumeBreakouts.length > 0 && (
                                <td>
                                    {volumeBreakoutMap[row.SYMBOL] ? (
                                        <span style={{ 
                                            color: volumeBreakoutMap[row.SYMBOL].ratio > 1 ? 'var(--apollo-success)' : 'var(--apollo-error)',
                                            fontWeight: '600'
                                        }}>
                                            {volumeBreakoutMap[row.SYMBOL].ratio}x
                                        </span>
                                    ) : '-'}
                                </td>
                            )}
                            {deliveryBreakouts.length > 0 && (
                                <td>
                                    {deliveryBreakoutMap[row.SYMBOL] ? (
                                        <span style={{ 
                                            color: deliveryBreakoutMap[row.SYMBOL].ratio > 1 ? 'var(--apollo-success)' : 'var(--apollo-error)',
                                            fontWeight: '600'
                                        }}>
                                            {deliveryBreakoutMap[row.SYMBOL].ratio}x
                                        </span>
                                    ) : '-'}
                                </td>
                            )}
                    </tr>
                ))}
            </tbody>
                </table>
            </div>
        </div>
    );
};
