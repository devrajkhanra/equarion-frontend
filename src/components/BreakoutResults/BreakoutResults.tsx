import React from 'react';

export type BreakoutResult = {
  symbol: string;
  ratio: number;
  currentValue: number;
  previousValue: number;
  field: string;
};

export type BreakoutResultsProps = {
  volumeBreakouts: BreakoutResult[];
  deliveryBreakouts: BreakoutResult[];
};

export const BreakoutResults: React.FC<BreakoutResultsProps> = ({
  volumeBreakouts,
  deliveryBreakouts
}) => {
  const renderBreakoutTable = (breakouts: BreakoutResult[], title: string, type: 'volume' | 'delivery') => {
    if (breakouts.length === 0) return null;

    // Sort by ratio descending
    const sortedBreakouts = [...breakouts].sort((a, b) => b.ratio - a.ratio);

    return (
      <div className="apollo-card">
        <div className="apollo-card-header">
          <h3 className="apollo-heading-3">{title}</h3>
          <p className="apollo-text-muted" style={{ margin: 0, fontSize: 'var(--apollo-font-size-sm)' }}>
            {sortedBreakouts.length} stocks with breakout data
          </p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="apollo-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Ratio</th>
                <th>Current {type === 'volume' ? 'Volume' : 'Delivery'}</th>
                <th>Previous {type === 'volume' ? 'Volume' : 'Delivery'}</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedBreakouts.map((breakout) => (
                <tr key={breakout.symbol}>
                  <td style={{ fontWeight: '600' }}>{breakout.symbol}</td>
                  <td>
                    <span style={{ 
                      color: breakout.ratio > 1 ? 'var(--apollo-success)' : 'var(--apollo-error)',
                      fontWeight: '600'
                    }}>
                      {breakout.ratio}x
                    </span>
                  </td>
                  <td>{breakout.currentValue.toLocaleString()}</td>
                  <td>{breakout.previousValue.toLocaleString()}</td>
                  <td>
                    <span style={{
                      padding: 'var(--apollo-space-1) var(--apollo-space-2)',
                      borderRadius: 'var(--apollo-radius-sm)',
                      fontSize: 'var(--apollo-font-size-xs)',
                      fontWeight: '500',
                      backgroundColor: breakout.ratio > 1 ? 'var(--apollo-success)' : 'var(--apollo-error)',
                      color: 'white'
                    }}>
                      {breakout.ratio > 1 ? 'Breakout' : 'Decline'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="apollo-grid" style={{ gap: 'var(--apollo-space-6)' }}>
      {renderBreakoutTable(volumeBreakouts, 'Volume Breakouts', 'volume')}
      {renderBreakoutTable(deliveryBreakouts, 'Delivery Volume Breakouts', 'delivery')}
    </div>
  );
};