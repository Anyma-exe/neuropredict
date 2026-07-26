import React from 'react';

// ============================================================
// ResultCard.tsx
// Displays the predicted profile + a confidence bar per class.
// Receives everything as props — it has no state of its own.
// ============================================================

const colors = {
  panel: '#8f7ea3',
  border: '#6b5b7d',
  pink: '#ff6ec7',
  cyan: '#00fff2',
  text: '#1a1424',
  textDim: '#4a3f57',
};

type ResultCardProps = {
  profileNames: string[];
  probabilities: number[] | null; // null = no prediction yet
};

export function ResultCard({ profileNames, probabilities }: ResultCardProps) {
  // Conditional rendering: if there's no prediction yet, show a
  // simple waiting message instead of trying to render bars for
  // data that doesn't exist. This "guard clause" pattern (return
  // early) is very common in React.
  if (!probabilities) {
    return (
      <p style={{ color: colors.textDim, fontFamily: 'Space Mono, monospace', fontSize: '13px' }}>
        No prediction yet — generate a subject and click "Analyze this profile".
      </p>
    );
  }

  // Find which class has the highest probability — that's our
  // "winning" predicted profile.
  const topIndex = probabilities.indexOf(Math.max(...probabilities));

  return (
    <div>
      <p style={{
        fontFamily: 'VT323, monospace',
        fontSize: '22px',
        color: colors.text,
        marginBottom: '16px',
      }}>
        Estimated profile:{' '}
        <span style={{ color: colors.pink, textShadow: `0 0 6px ${colors.pink}` }}>
          {profileNames[topIndex]}
        </span>
      </p>

      {profileNames.map((name, i) => (
        <div key={name} style={{ marginBottom: '10px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'Space Mono, monospace',
            fontSize: '12px',
            color: colors.textDim,
            marginBottom: '3px',
          }}>
            <span>{name}</span>
            <span>{(probabilities[i] * 100).toFixed(1)}%</span>
          </div>
          <div style={{
            height: '6px',
            background: colors.border,
            borderRadius: '3px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${probabilities[i] * 100}%`,
              height: '100%',
              background: i === topIndex ? colors.cyan : colors.textDim,
              boxShadow: i === topIndex ? `0 0 6px ${colors.cyan}` : 'none',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}
