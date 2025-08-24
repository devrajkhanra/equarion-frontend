import React from "react";

type IndiceData = {
    IndexName: string;
    IndexDate: string;
    OpenIndexValue: string;
    HighIndexValue: string;
    LowIndexValue: string;
    ClosingIndexValue: string;
    Volume: string;
};

export const IndiceTable: React.FC<{ data?: IndiceData[] }> = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="apollo-loading">
                <p>No indice data available.</p>
            </div>
        );
    }

    return (
        <div className="apollo-card">
            <div className="apollo-card-header">
                <h3 className="apollo-heading-3">Index Data</h3>
                <p className="apollo-text-muted" style={{ margin: 0, fontSize: 'var(--apollo-font-size-sm)' }}>
                    {data.length} records found
                </p>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table className="apollo-table">
            <thead>
                <tr>
                        <th>Index Name</th>
                        <th>Date</th>
                        <th>Open</th>
                        <th>High</th>
                        <th>Low</th>
                        <th>Close</th>
                        <th>Volume</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, idx) => (
                    <tr key={`${row.IndexName}-${row.IndexDate}-${idx}`}>
                            <td style={{ fontWeight: '600' }}>{row.IndexName}</td>
                            <td>{row.IndexDate}</td>
                            <td>{parseFloat(row.OpenIndexValue).toLocaleString()}</td>
                            <td>{parseFloat(row.HighIndexValue).toLocaleString()}</td>
                            <td>{parseFloat(row.LowIndexValue).toLocaleString()}</td>
                            <td>{parseFloat(row.ClosingIndexValue).toLocaleString()}</td>
                            <td>{parseInt(row.Volume).toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
                </table>
            </div>
        </div>
    );
};
