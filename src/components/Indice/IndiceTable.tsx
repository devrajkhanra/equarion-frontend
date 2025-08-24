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
    if (!data || data.length === 0) return <p>No indice data available.</p>;

    return (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
            <thead>
                <tr>
                    {[
                        "Index Name",
                        "Date",
                        "Open",
                        "High",
                        "Low",
                        "Close",
                        "Volume",
                    ].map((header) => (
                        <th key={header} style={{ border: "1px solid #ccc", padding: 8 }}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, idx) => (
                    <tr key={`${row.IndexName}-${row.IndexDate}-${idx}`}>
                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.IndexName}</td>
                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.IndexDate}</td>
                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.OpenIndexValue}</td>
                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.HighIndexValue}</td>
                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.LowIndexValue}</td>
                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.ClosingIndexValue}</td>
                        <td style={{ border: "1px solid #ccc", padding: 8 }}>{row.Volume}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
