import React from 'react';

// ============================================================
// ContributionChart.tsx
// Displays how much each variable contributed to the prediction,
// as horizontal bars. Positive = pushed toward the predicted
// profile, negative = pushed against it.
// ============================================================

const colors = {
  border: '#6b5b7d',
  pink: '#ff6ec7',
  cyan: '#00fff2',
  text: '#1a1424',
  textDim: '#4a3f57',
};

const VARIABLE_LABELS = [
  'Processing speed',
  'Working memory',
  'Inhibition',
  'Cognitive flexibility',
];

type Contribution = { featureIndex: number; contribution: number };

type ContributionChartProps = {
  contributions: Contribution[] | null; // null = nothing to explain yet
};

export function ContributionChart({ contributions }: ContributionChartProps) {
  if (!contributions) {
    return (
      <p style={{ color: colors.textDim, fontFamily: 'Space Mono, monospace', fontSize: '13px' }}>
        Nothing to explain yet — analyze a subject first.
      </p>
    );
  }

  // Sort by absolute contribution, largest first, so the most
  // influential variable is always at the top of the chart.
  // We copy the array with [...contributions] first — sorting
  // in place would mutate the prop, which React data should
  // never do.
  const sorted = [...contributions].sort(
    (a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)
  );

  return (
    <div>
      {sorted.map(({ featureIndex, contribution }) => {
        const isPositive = contribution >= 0;
        const widthPct = Math.min(Math.abs(contribution), 100);

        return (
          <div key={featureIndex} style={{ marginBottom: '12px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'Space Mono, monospace',
              fontSize: '12px',
              color: colors.textDim,
              marginBottom: '3px',
            }}>
              <span>{VARIABLE_LABELS[featureIndex]}</span>
              <span style={{ color: isPositive ? colors.cyan : colors.pink }}>
                {isPositive ? '+' : ''}{contribution.toFixed(1)}%
              </span>
            </div>
            {/* A centered track: bar grows left for negative, right for positive */}
            <div style={{
              position: 'relative',
              height: '8px',
              background: colors.border,
              borderRadius: '3px',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                left: isPositive ? '50%' : `${50 - widthPct / 2}%`,
                width: `${widthPct / 2}%`,
                height: '100%',
                background: isPositive ? colors.cyan : colors.pink,
                boxShadow: `0 0 5px ${isPositive ? colors.cyan : colors.pink}`,
              }} />
              {/* Center line marking zero */}
              <div style={{
                position: 'absolute',
                left: '50%',
                width: '1px',
                height: '100%',
                background: colors.text,
                opacity: 0.3,
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
