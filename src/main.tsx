// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";

import { Sidebar, sectorIndexMap } from "../components/Sidebar";
import { DatePickerComponent, DateSelectionMode } from "../components/DatePicker/DatePickerComponent";
import { BreakoutCalculator } from "../components/BreakoutCalculator/BreakoutCalculator";
import { StockTable } from "../components/Stock/StockTable";
import { IndiceTable } from "../components/Indice/IndiceTable";
import { NiftyList } from "../components/Nifty/NiftyList";

import { useNiftyCompanies } from "../hooks/useNiftyCompanies";
import { useStockData } from "../hooks/useStockData";
import { useIndiceData } from "../hooks/useIndiceData";

export const Dashboard = () => {
    // Selected sector and its mapped index name
    const [selectedSector, setSelectedSector] = useState<string>("");
    const [selectedIndexName, setSelectedIndexName] = useState<string>("");

    // Date selection state
    const [filterDates, setFilterDates] = useState<string[]>([]);
    const [dateMode, setDateMode] = useState<DateSelectionMode>('custom');
    
    // Breakout analysis state
    const [volumeBreakouts, setVolumeBreakouts] = useState<any[]>([]);
    const [deliveryBreakouts, setDeliveryBreakouts] = useState<any[]>([]);

    // Change sector handler
    const handleSectorSelect = (sector: string, indexName: string) => {
        setSelectedSector(sector);
        setSelectedIndexName(indexName);

        // Reset filters when sector changes
        setFilterDates([]);
        setVolumeBreakouts([]);
        setDeliveryBreakouts([]);
    };

    // Handle date selection changes
    const handleDateChange = (dates: string[], mode: DateSelectionMode) => {
        setFilterDates(dates);
        setDateMode(mode);
    };

    // Handle breakout analysis changes
    const handleBreakoutChange = (volumeBreakouts: any[], deliveryBreakouts: any[]) => {
        setVolumeBreakouts(volumeBreakouts);
        setDeliveryBreakouts(deliveryBreakouts);
    };

    // Fetch companies belonging to the selected sector (treat sector as industry for this)
    // This hook will return only companies for the sector
    const { data: companyData, loading: loadingCompanies } = useNiftyCompanies(
        selectedSector || undefined
    );
    const sectorStocks = companyData?.niftyCompanies || [];

    // Extract symbols of sector stocks to query stock data
    const sectorSymbols = sectorStocks.map((s) => s.Symbol);

    // Fetch stockData for the selected symbols and date range
    const { data: stockDataRaw, loading: loadingStockData } = useStockData(
        filterDates,
        sectorSymbols
    );

        let data = stockDataRaw.stockData;

        if (volumeBreakout) {
            data = data.filter((d) => {
                // For volume breakout, volume of current date > previous date's volume for that symbol
                // Implement client-side comparing current day vs previous day volume
                // This requires grouping and sorting data by symbol and date
                return true; // placeholder: implement actual logic
            });
        }

        if (deliveryBreakout) {
            data = data.filter((d) => {
                // Similar delivery breakout filter by multiplier
                // Implement actual comparison here
                return true; // placeholder: implement actual logic
            });
        }

        return data;
    }, [stockDataRaw, volumeBreakout, deliveryBreakout, deliveryMultiplier]);

    // Fetch indiceData for the selected index name and date range
    const { data: indiceData, loading: loadingIndice } = useIndiceData(
        filterDates,
        selectedIndexName ? [selectedIndexName] : []
    );

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            <Sidebar onSelectSector={handleSectorSelect} />

            <main
                style={{
                    padding: 24,
                    flexGrow: 1,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                }}
            >
                {selectedSector ? (
                    <>
                        <h1>Sector: {selectedSector}</h1>
                        <StockFiltersExtended
                            onChange={({ dates, volumeBreakout, deliveryBreakout, deliveryMultiplier }) => {
                                setFilterDates(dates);
                                setVolumeBreakout(volumeBreakout);
                                setDeliveryBreakout(deliveryBreakout);
                                setDeliveryMultiplier(deliveryMultiplier);
                            }}
                        />

                        <section>
                            <h2>Stocks (filtered by sector and filters)</h2>
                            {loadingCompanies || loadingStockData ? (
                                <p>Loading stock data...</p>
                            ) : (
                                <StockTable data={filteredStockData} />
                            )}
                        </section>

                        <section>
                            <h2>Indice Data ({selectedIndexName})</h2>
                            {loadingIndice ? (
                                <p>Loading indice data...</p>
                            ) : (
                                <IndiceTable data={indiceData?.indiceData} />
                            )}
                        </section>

                        <section>
                            <h2>Companies in {selectedSector} Sector</h2>
                            {loadingCompanies ? (
                                <p>Loading companies...</p>
                            ) : (
                                <NiftyList data={sectorStocks} />
                            )}
                        </section>
                    </>
                ) : (
                    <h1>Please select a sector from the sidebar.</h1>
                )}
            </main>
        </div>
    );
};
