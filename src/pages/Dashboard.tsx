import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { DatePickerComponent, type DateSelectionMode } from "../components/DatePicker/DatePickerComponent";
import { BreakoutCalculator } from "../components/BreakoutCalculator/BreakoutCalculator";
import { StockTable } from "../components/Stock/StockTable";
import { IndiceTable } from "../components/Indice/IndiceTable";
import { NiftyList } from "../components/Nifty/NiftyList";
import { useNiftyCompanies } from "../hooks/useNiftyCompanies";
import { useStockData } from "../hooks/useStockData";
import { useIndiceData } from "../hooks/useIndiceData";

export const Dashboard = () => {
    const [selectedSector, setSelectedSector] = useState<string>("");
    const [selectedIndexName, setSelectedIndexName] = useState<string>("");
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [dateMode, setDateMode] = useState<DateSelectionMode>('custom');
    const [volumeBreakouts, setVolumeBreakouts] = useState<any[]>([]);
    const [deliveryBreakouts, setDeliveryBreakouts] = useState<any[]>([]);

    const handleSectorSelect = (sector: string, indexName: string) => {
        setSelectedSector(sector);
        setSelectedIndexName(indexName);
        // Reset breakouts when sector changes
        setVolumeBreakouts([]);
        setDeliveryBreakouts([]);
    };

    const handleDateChange = (dates: string[], mode: DateSelectionMode) => {
        setSelectedDates(dates);
        setDateMode(mode);
    };

    const handleBreakoutChange = (volumeBreakouts: any[], deliveryBreakouts: any[]) => {
        setVolumeBreakouts(volumeBreakouts);
        setDeliveryBreakouts(deliveryBreakouts);
    };

    // Fetch companies for selected sector
    const { data: companyData, loading: loadingCompanies } = useNiftyCompanies(
        selectedSector || undefined
    );
    const sectorStocks = companyData?.niftyCompanies || companyData?.nifty50List || [];

    // Extract symbols for stock data query
    const sectorSymbols = sectorStocks.map((s: any) => s.Symbol);

    // Fetch stock data
    const { data: stockDataRaw, loading: loadingStockData } = useStockData(
        selectedDates,
        sectorSymbols
    );

    // Fetch indice data
    const { data: indiceData, loading: loadingIndice } = useIndiceData(
        selectedDates,
        selectedIndexName ? [selectedIndexName] : []
    );

    const stockData = stockDataRaw?.stockData || [];

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            <Sidebar onSelectSector={handleSectorSelect} selectedSector={selectedSector} />

            <main className="apollo-container" style={{ 
                flexGrow: 1, 
                overflowY: "auto", 
                padding: 'var(--apollo-space-6)',
                display: "flex",
                flexDirection: "column",
                gap: 'var(--apollo-space-6)'
            }}>
                {selectedSector ? (
                    <>
                        <div>
                            <h1 className="apollo-heading-1">
                                {selectedSector} Sector Analysis
                            </h1>
                            <p className="apollo-text-muted">
                                Comprehensive analysis of {selectedSector} sector stocks with breakout calculations
                            </p>
                        </div>

                        <div className="apollo-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--apollo-space-6)' }}>
                            <DatePickerComponent onChange={handleDateChange} />
                            <BreakoutCalculator
                                stockData={stockData}
                                selectedDates={selectedDates}
                                dateMode={dateMode}
                                onBreakoutChange={handleBreakoutChange}
                            />
                        </div>

                        <section>
                            <StockTable 
                                data={stockData} 
                                volumeBreakouts={volumeBreakouts}
                                deliveryBreakouts={deliveryBreakouts}
                            />
                        </section>

                        <div className="apollo-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--apollo-space-6)' }}>
                            <section>
                                <IndiceTable data={indiceData?.indiceData} />
                            </section>

                            <section>
                                <NiftyList data={sectorStocks} />
                            </section>
                        </div>
                    </>
                ) : (
                    <div className="apollo-flex apollo-flex-col apollo-items-center" style={{ 
                        justifyContent: 'center', 
                        height: '60vh',
                        textAlign: 'center'
                    }}>
                        <h1 className="apollo-heading-1">Financial Data Analysis</h1>
                        <p className="apollo-text-muted" style={{ fontSize: 'var(--apollo-font-size-lg)', marginBottom: 'var(--apollo-space-8)' }}>
                            Select a sector from the sidebar to begin your analysis
                        </p>
                        <div className="apollo-card" style={{ maxWidth: '500px', textAlign: 'left' }}>
                            <div className="apollo-card-body">
                                <h3 className="apollo-heading-3">Features Available:</h3>
                                <ul style={{ margin: 0, paddingLeft: 'var(--apollo-space-6)' }}>
                                    <li>Custom, weekly, and monthly date selection</li>
                                    <li>Volume and delivery breakout calculations</li>
                                    <li>Sector-specific stock filtering</li>
                                    <li>Index performance tracking</li>
                                    <li>Company listings by sector</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};