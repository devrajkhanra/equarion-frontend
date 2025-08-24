import React, { useState } from "react";

export const sectorIndexMap: Record<string, string> = {
    Banking: "Nifty Bank",
    "Financial Services": "Nifty Financial Services",
    "Information Technology": "Nifty IT",
    Healthcare: "Nifty Healthcare",
    Pharmaceuticals: "Nifty Pharma",
    "Consumer Goods (FMCG)": "Nifty FMCG",
    Energy: "Nifty Energy",
    "Oil & Gas": "Nifty Oil & Gas",
    Auto: "Nifty Auto",
    Realty: "Nifty Realty",
    "Media & Entertainment": "Nifty Media",
    Metal: "Nifty Metal",
    Infrastructure: "Nifty Infrastructure",
    "PSU Banks": "Nifty PSU Bank",
    "Private Banks": "Nifty Private Bank",
    "Services Sector": "Nifty Services Sector",
};

type SidebarProps = {
    onSelectSector: (sector: string, indexName: string) => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ onSelectSector }) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapse = () => setCollapsed(!collapsed);

    return (
        <div
            style={{
                width: collapsed ? "60px" : "250px",
                borderRight: "1px solid #ccc",
                height: "100vh",
                overflowY: "auto",
                transition: "width 0.3s",
            }}
        >
            <button onClick={toggleCollapse} style={{ width: "100%", padding: 8 }}>
                {collapsed ? "➡️" : "⬅️ Collapse"}
            </button>
            {!collapsed && (
                <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
                    {Object.entries(sectorIndexMap).map(([sector, index]) => (
                        <li
                            key={sector}
                            style={{
                                padding: "8px 16px",
                                cursor: "pointer",
                                borderBottom: "1px solid #eee",
                                userSelect: "none",
                            }}
                            onClick={() => onSelectSector(sector, index)}
                        >
                            {sector}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
