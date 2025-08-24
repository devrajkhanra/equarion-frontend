import React from 'react';

type Company = {
    CompanyName: string;
    Symbol: string;
    Industry: string;
};

export const NiftyList: React.FC<{ data?: Company[] }> = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="apollo-loading">
                <p>No companies available.</p>
            </div>
        );
    }

    return (
        <div className="apollo-card">
            <div className="apollo-card-header">
                <h3 className="apollo-heading-3">Companies in Sector</h3>
                <p className="apollo-text-muted" style={{ margin: 0, fontSize: 'var(--apollo-font-size-sm)' }}>
                    {data.length} companies found
                </p>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table className="apollo-table">
            <thead>
                <tr>
                        <th>Company Name</th>
                        <th>Symbol</th>
                        <th>Industry</th>
                </tr>
            </thead>
            <tbody>
                {data.map((c) => (
                    <tr key={c.Symbol}>
                            <td>{c.CompanyName}</td>
                            <td style={{ fontWeight: '600' }}>{c.Symbol}</td>
                            <td>{c.Industry}</td>
                    </tr>
                ))}
            </tbody>
                </table>
            </div>
        </div>
    );
};
