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
    selectedSector: string;
};

export const Sidebar: React.FC<SidebarProps> = ({ onSelectSector, selectedSector }) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapse = () => setCollapsed(!collapsed);

    return (
        <div>
            <button className="apollo-btn apollo-btn-sm" onClick={toggleCollapse}>
                {collapsed ? "→" : "← Collapse"}
            </button>

            {!collapsed && (
                <>
                    <h2>Sectors</h2>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {Object.entries(sectorIndexMap).map(([sector, index]) => (
                            <li
                                key={sector}
                                className={`apollo-sidebar-item ${selectedSector === sector ? "active" : ""}`}
                                onClick={() => onSelectSector(sector, index)}
                                style={{ cursor: "pointer" }}
                            >
                                {sector}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};
