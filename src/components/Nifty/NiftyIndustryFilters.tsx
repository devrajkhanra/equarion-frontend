import React from "react";

export const IndustryFilter = ({
    onSelect,
}: {
    onSelect: (industry: string) => void;
}) => {
    const industries = [
        "",
        "Banking",
        "Financial Services",
        "Information Technology",
        "Healthcare",
        "Pharmaceuticals",
        "Consumer Goods (FMCG)",
        "Energy",
        "Oil & Gas",
        "Auto",
        "Realty",
        "Media & Entertainment",
        "Metal",
        "Infrastructure",
        "PSU Banks",
        "Private Banks",
        "Services Sector",
    ];

    return (
        <select onChange={(e) => onSelect(e.target.value)} style={{ marginBottom: 16 }}>
            {industries.map((ind, idx) => (
                <option key={idx} value={ind}>
                    {ind === "" ? "All" : ind}
                </option>
            ))}
        </select>
    );
};
