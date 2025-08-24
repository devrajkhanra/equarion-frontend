import React from 'react';

type Company = {
    CompanyName: string;
    Symbol: string;
    Industry: string;
};

export const NiftyList: React.FC<{ data?: Company[] }> = ({ data }) => {
    if (!data || data.length === 0) return <p>No companies available.</p>;

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
            <thead>
                <tr>
                    <th style={{ border: '1px solid #ccc', padding: 8 }}>Company Name</th>
                    <th style={{ border: '1px solid #ccc', padding: 8 }}>Symbol</th>
                    <th style={{ border: '1px solid #ccc', padding: 8 }}>Industry</th>
                </tr>
            </thead>
            <tbody>
                {data.map((c) => (
                    <tr key={c.Symbol}>
                        <td style={{ border: '1px solid #ccc', padding: 8 }}>{c.CompanyName}</td>
                        <td style={{ border: '1px solid #ccc', padding: 8 }}>{c.Symbol}</td>
                        <td style={{ border: '1px solid #ccc', padding: 8 }}>{c.Industry}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
