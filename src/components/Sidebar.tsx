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
        <div
            className="apollo-sidebar"
            style={{ width: collapsed ? "60px" : "280px" }}
        >
            <button 
                className="apollo-btn apollo-btn-secondary" 
                onClick={toggleCollapse} 
                style={{ width: "100%", margin: 'var(--apollo-space-4)', borderRadius: 'var(--apollo-radius-md)' }}
            >
                {collapsed ? "→" : "← Collapse"}
            </button>
            {!collapsed && (
                <div style={{ padding: '0 var(--apollo-space-4) var(--apollo-space-4)' }}>
                    <h3 className="apollo-heading-3" style={{ marginBottom: 'var(--apollo-space-4)' }}>
                        Sectors
                    </h3>
                </div>
            )}
            {!collapsed && (
                <div>
                    {Object.entries(sectorIndexMap).map(([sector, index]) => (
                        <div
                            key={sector}
                            className={`apollo-sidebar-item ${selectedSector === sector ? 'active' : ''}`}
                            onClick={() => onSelectSector(sector, index)}
                        >
                            {sector}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
