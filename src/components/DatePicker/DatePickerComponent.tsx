import React, { useState, useEffect } from 'react';
import { formatDateForBackend, getBusinessDatesBetween, isBusinessDay } from '../../utils/utilities';

export type DateSelectionMode = 'custom' | 'weekly' | 'monthly';

export type DatePickerProps = {
  onChange: (dates: string[], mode: DateSelectionMode) => void;
};

export const DatePickerComponent: React.FC<DatePickerProps> = ({ onChange }) => {
  const [mode, setMode] = useState<DateSelectionMode>('custom');
  const [customFromDate, setCustomFromDate] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [customToDate, setCustomToDate] = useState<Date>(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date()));
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Get start of week (Monday)
  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  // Get end of week (Friday for business days)
  function getWeekEnd(weekStart: Date): Date {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 4); // Friday
    return d;
  }

  // Get start of month
  function getMonthStart(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  // Get end of month
  function getMonthEnd(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  // Generate dates based on current mode
  useEffect(() => {
    let dates: string[] = [];

    switch (mode) {
      case 'custom':
        if (customFromDate && customToDate && customFromDate <= customToDate) {
          const businessDates = getBusinessDatesBetween(customFromDate, customToDate);
          dates = businessDates.map(formatDateForBackend);
        }
        break;

      case 'weekly':
        const weekEnd = getWeekEnd(currentWeekStart);
        const weekDates = getBusinessDatesBetween(currentWeekStart, weekEnd);
        dates = weekDates.map(formatDateForBackend);
        break;

      case 'monthly':
        const monthStart = getMonthStart(currentMonth);
        const monthEnd = getMonthEnd(currentMonth);
        const monthDates = getBusinessDatesBetween(monthStart, monthEnd);
        dates = monthDates.map(formatDateForBackend);
        break;
    }

    onChange(dates, mode);
  }, [mode, customFromDate, customToDate, currentWeekStart, currentMonth, onChange]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newWeekStart);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getWeekStart(new Date()));
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  const formatWeekRange = (weekStart: Date) => {
    const weekEnd = getWeekEnd(weekStart);
    return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="apollo-card">
      <div className="apollo-card-header">
        <h3 className="apollo-heading-3">Date Selection</h3>
      </div>
      <div className="apollo-card-body">
        {/* Mode Selection */}
        <div className="apollo-flex" style={{ marginBottom: 'var(--apollo-space-6)' }}>
          <button
            className={`apollo-btn ${mode === 'custom' ? 'apollo-btn-primary' : 'apollo-btn-secondary'}`}
            onClick={() => setMode('custom')}
          >
            Custom Range
          </button>
          <button
            className={`apollo-btn ${mode === 'weekly' ? 'apollo-btn-primary' : 'apollo-btn-secondary'}`}
            onClick={() => setMode('weekly')}
          >
            Weekly
          </button>
          <button
            className={`apollo-btn ${mode === 'monthly' ? 'apollo-btn-primary' : 'apollo-btn-secondary'}`}
            onClick={() => setMode('monthly')}
          >
            Monthly
          </button>
        </div>

        {/* Custom Date Range */}
        {mode === 'custom' && (
          <div className="apollo-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--apollo-space-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--apollo-space-2)', fontSize: 'var(--apollo-font-size-sm)', fontWeight: '500' }}>
                From Date:
              </label>
              <input
                type="date"
                className="apollo-input"
                value={customFromDate.toISOString().slice(0, 10)}
                onChange={(e) => setCustomFromDate(new Date(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--apollo-space-2)', fontSize: 'var(--apollo-font-size-sm)', fontWeight: '500' }}>
                To Date:
              </label>
              <input
                type="date"
                className="apollo-input"
                value={customToDate.toISOString().slice(0, 10)}
                onChange={(e) => setCustomToDate(new Date(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {/* Weekly Selection */}
        {mode === 'weekly' && (
          <div>
            <div className="apollo-flex apollo-items-center apollo-justify-between" style={{ marginBottom: 'var(--apollo-space-4)' }}>
              <button className="apollo-btn apollo-btn-secondary apollo-btn-sm" onClick={() => navigateWeek('prev')}>
                ← Previous Week
              </button>
              <span style={{ fontSize: 'var(--apollo-font-size-lg)', fontWeight: '500' }}>
                {formatWeekRange(currentWeekStart)}
              </span>
              <button className="apollo-btn apollo-btn-secondary apollo-btn-sm" onClick={() => navigateWeek('next')}>
                Next Week →
              </button>
            </div>
            <div className="apollo-flex apollo-items-center" style={{ marginBottom: 'var(--apollo-space-4)', justifyContent: 'center' }}>
              <button className="apollo-btn apollo-btn-accent apollo-btn-sm" onClick={goToCurrentWeek}>
                Go to Current Week
              </button>
            </div>
            <div style={{ fontSize: 'var(--apollo-font-size-sm)', color: 'var(--apollo-text-muted)' }}>
              Business days only (Monday - Friday)
            </div>
          </div>
        )}

        {/* Monthly Selection */}
        {mode === 'monthly' && (
          <div>
            <div className="apollo-flex apollo-items-center apollo-justify-between" style={{ marginBottom: 'var(--apollo-space-4)' }}>
              <button className="apollo-btn apollo-btn-secondary apollo-btn-sm" onClick={() => navigateMonth('prev')}>
                ← Previous Month
              </button>
              <span style={{ fontSize: 'var(--apollo-font-size-lg)', fontWeight: '500' }}>
                {formatMonth(currentMonth)}
              </span>
              <button className="apollo-btn apollo-btn-secondary apollo-btn-sm" onClick={() => navigateMonth('next')}>
                Next Month →
              </button>
            </div>
            <div className="apollo-flex apollo-items-center" style={{ marginBottom: 'var(--apollo-space-4)', justifyContent: 'center' }}>
              <button className="apollo-btn apollo-btn-accent apollo-btn-sm" onClick={goToCurrentMonth}>
                Go to Current Month
              </button>
            </div>
            <div style={{ fontSize: 'var(--apollo-font-size-sm)', color: 'var(--apollo-text-muted)' }}>
              Business days only
            </div>
          </div>
        )}
      </div>
    </div>
  );
};