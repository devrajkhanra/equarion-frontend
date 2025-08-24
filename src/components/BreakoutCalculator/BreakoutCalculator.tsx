import React, { useState, useEffect } from 'react';
import { type DateSelectionMode } from '../DatePicker/DatePickerComponent';

export type BreakoutCalculatorProps = {
  stockData: any[];
  selectedDates: string[];
  dateMode: DateSelectionMode;
  onBreakoutChange: (volumeBreakouts: any[], deliveryBreakouts: any[]) => void;
};

export type CalculationMethod = 'sum' | 'peak';

export const BreakoutCalculator: React.FC<BreakoutCalculatorProps> = ({
  stockData,
  selectedDates,
  dateMode,
  onBreakoutChange
}) => {
  const [enableVolumeBreakout, setEnableVolumeBreakout] = useState(false);
  const [enableDeliveryBreakout, setEnableDeliveryBreakout] = useState(false);
  const [volumeMethod, setVolumeMethod] = useState<CalculationMethod>('sum');
  const [deliveryMethod, setDeliveryMethod] = useState<CalculationMethod>('sum');

  // Calculate breakouts whenever settings change
  useEffect(() => {
    if (!stockData || stockData.length === 0 || selectedDates.length === 0) {
      onBreakoutChange([], []);
      return;
    }

    const volumeBreakouts = enableVolumeBreakout ? calculateVolumeBreakouts() : [];
    const deliveryBreakouts = enableDeliveryBreakout ? calculateDeliveryBreakouts() : [];

    onBreakoutChange(volumeBreakouts, deliveryBreakouts);
  }, [stockData, selectedDates, dateMode, enableVolumeBreakout, enableDeliveryBreakout, volumeMethod, deliveryMethod]);

  const calculateVolumeBreakouts = () => {
    return calculateBreakouts('TTL_TRD_QNTY', volumeMethod);
  };

  const calculateDeliveryBreakouts = () => {
    return calculateBreakouts('DELIV_QTY', deliveryMethod);
  };

  const calculateBreakouts = (field: string, method: CalculationMethod) => {
    const results: any[] = [];

    // Group data by symbol
    const symbolGroups = stockData.reduce((acc, item) => {
      const symbol = item.SYMBOL;
      if (!acc[symbol]) acc[symbol] = [];
      acc[symbol].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    Object.entries(symbolGroups).forEach(([symbol, data]) => {
      // Sort by date
      const sortedData = data.sort((a, b) => {
        const dateA = a.DATE1.replace(/\D/g, '');
        const dateB = b.DATE1.replace(/\D/g, '');
        return dateA.localeCompare(dateB);
      });
      
      let currentValue: number;
      let previousValue: number;
      let ratio: number;

      switch (dateMode) {
        case 'custom':
          if (selectedDates.length >= 2) {
            const latestDate = selectedDates[selectedDates.length - 1];
            const previousDate = selectedDates[selectedDates.length - 2];
            
            const latestData = sortedData.find(d => d.DATE1.replace(/\D/g, '') === latestDate);
            const previousData = sortedData.find(d => d.DATE1.replace(/\D/g, '') === previousDate);
            
            if (latestData && previousData) {
              currentValue = parseFloat(latestData[field]) || 0;
              previousValue = parseFloat(previousData[field]) || 0;
              ratio = previousValue > 0 ? currentValue / previousValue : 0;
            } else {
              ratio = 0;
            }
          } else {
            ratio = 0;
          }
          break;

        case 'weekly':
        case 'monthly':
          // For weekly/monthly, we need to compare current period vs previous period
          const periodData = getPeriodData(sortedData, selectedDates, method);
          const previousPeriodData = getPreviousPeriodData(sortedData, selectedDates, dateMode, method);
          
          currentValue = calculatePeriodValue(periodData, field, method);
          previousValue = calculatePeriodValue(previousPeriodData, field, method);
          ratio = previousValue > 0 ? currentValue / previousValue : 0;
          break;

        default:
          ratio = 0;
      }

      if (ratio > 0) {
        results.push({
          symbol,
          ratio: Math.round(ratio * 100) / 100, // Round to 2 decimal places
          currentValue,
          previousValue,
          field
        });
      }
    });

    return results;
  };

  const getPeriodData = (data: any[], selectedDates: string[], method: CalculationMethod) => {
    return data.filter(item => {
      const itemDate = item.DATE1.replace(/\D/g, '');
      return selectedDates.includes(itemDate);
    });
  };

  const getPreviousPeriodData = (data: any[], selectedDates: string[], mode: DateSelectionMode, method: CalculationMethod) => {
    // Calculate previous period dates based on mode
    const sortedDates = selectedDates.sort();
    const firstDate = new Date(
      parseInt(sortedDates[0].slice(4, 8)), // year
      parseInt(sortedDates[0].slice(2, 4)) - 1, // month (0-indexed)
      parseInt(sortedDates[0].slice(0, 2)) // day
    );

    let previousDates: string[] = [];

    if (mode === 'weekly') {
      // Previous week
      const previousWeekStart = new Date(firstDate);
      previousWeekStart.setDate(previousWeekStart.getDate() - 7);
      
      for (let i = 0; i < 5; i++) { // 5 business days
        const date = new Date(previousWeekStart);
        date.setDate(date.getDate() + i);
        if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
          const dateStr = formatDateForBackend(date);
          previousDates.push(dateStr);
        }
      }
    } else if (mode === 'monthly') {
      // Previous month
      const previousMonth = new Date(firstDate);
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      
      const monthStart = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1);
      const monthEnd = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0);
      
      for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
        if (d.getDay() !== 0 && d.getDay() !== 6) { // Skip weekends
          const dateStr = formatDateForBackend(new Date(d));
          previousDates.push(dateStr);
        }
      }
    }

    return data.filter(item => {
      const itemDate = item.DATE1.replace(/\D/g, '');
      return previousDates.includes(itemDate);
    });
  };

  const calculatePeriodValue = (periodData: any[], field: string, method: CalculationMethod): number => {
    if (periodData.length === 0) return 0;

    if (method === 'sum') {
      return periodData.reduce((sum, item) => sum + (parseFloat(item[field]) || 0), 0);
    } else { // peak
      return Math.max(...periodData.map(item => parseFloat(item[field]) || 0));
    }
  };

  const formatDateForBackend = (date: Date): string => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return dd + mm + yyyy;
  };

  const showMethodSelection = dateMode === 'weekly' || dateMode === 'monthly';

  return (
    <div className="apollo-card">
      <div className="apollo-card-header">
        <h3 className="apollo-heading-3">Breakout Analysis</h3>
      </div>
      <div className="apollo-card-body">
        {/* Volume Breakout */}
        <div style={{ marginBottom: 'var(--apollo-space-6)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--apollo-space-2)', marginBottom: 'var(--apollo-space-3)' }}>
            <input
              type="checkbox"
              checked={enableVolumeBreakout}
              onChange={(e) => setEnableVolumeBreakout(e.target.checked)}
            />
            <span style={{ fontWeight: '500' }}>Enable Volume Breakout Analysis</span>
          </label>

          {enableVolumeBreakout && showMethodSelection && (
            <div style={{ marginLeft: 'var(--apollo-space-6)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--apollo-space-2)', fontSize: 'var(--apollo-font-size-sm)', fontWeight: '500' }}>
                Calculation Method:
              </label>
              <select
                className="apollo-select"
                value={volumeMethod}
                onChange={(e) => setVolumeMethod(e.target.value as CalculationMethod)}
              >
                <option value="sum">Sum of period volumes</option>
                <option value="peak">Highest volume day in period</option>
              </select>
            </div>
          )}
        </div>

        {/* Delivery Breakout */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--apollo-space-2)', marginBottom: 'var(--apollo-space-3)' }}>
            <input
              type="checkbox"
              checked={enableDeliveryBreakout}
              onChange={(e) => setEnableDeliveryBreakout(e.target.checked)}
            />
            <span style={{ fontWeight: '500' }}>Enable Delivery Volume Breakout Analysis</span>
          </label>

          {enableDeliveryBreakout && showMethodSelection && (
            <div style={{ marginLeft: 'var(--apollo-space-6)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--apollo-space-2)', fontSize: 'var(--apollo-font-size-sm)', fontWeight: '500' }}>
                Calculation Method:
              </label>
              <select
                className="apollo-select"
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value as CalculationMethod)}
              >
                <option value="sum">Sum of period delivery volumes</option>
                <option value="peak">Highest delivery volume day in period</option>
              </select>
            </div>
          )}
        </div>

        {/* Calculation Info */}
        <div style={{ marginTop: 'var(--apollo-space-6)', padding: 'var(--apollo-space-4)', backgroundColor: 'var(--apollo-surface)', borderRadius: 'var(--apollo-radius-md)' }}>
          <h4 style={{ margin: '0 0 var(--apollo-space-2) 0', fontSize: 'var(--apollo-font-size-sm)', fontWeight: '600' }}>
            Calculation Logic:
          </h4>
          <ul style={{ margin: 0, paddingLeft: 'var(--apollo-space-4)', fontSize: 'var(--apollo-font-size-xs)', color: 'var(--apollo-text-muted)' }}>
            <li><strong>Custom Dates:</strong> Latest date ÷ Previous date</li>
            <li><strong>Weekly/Monthly:</strong> Current period ÷ Previous period</li>
            <li><strong>Sum Method:</strong> Total volume/delivery for the period</li>
            <li><strong>Peak Method:</strong> Highest single day volume/delivery</li>
            <li>All results rounded to 2 decimal places</li>
            <li>Only business days (Monday-Friday) are considered</li>
          </ul>
        </div>
      </div>
    </div>
  );
};