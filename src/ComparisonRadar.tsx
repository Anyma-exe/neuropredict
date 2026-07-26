import React from 'react';

// ============================================================
// ComparisonRadar.tsx
// Hand-drawn SVG radar chart comparing the subject's 4 features
// to a reference ("healthy"/average) group — the Balanced
// profile's means, i.e. [0, 0, 0, 0].
// ============================================================

const colors = {
  border: '#6b5b7d',
  pink: '#ff6ec7',
  cyan: '#00fff2',
  text: '#1a1424',
  textDim: '#4a3f57',
};

const VARIABLE_LABELS = [
  'Speed',
  'Memory',
  'Inhibition',
  'Flexibility',
];

const SIZE = 220;          // SVG viewbox size
const CENTER = SIZE / 2;
const MAX_RADIUS = 85;      // how far the outer ring sits from center
const VALUE_RANGE = 3;      // our features live roughly in [-3, 3]

type ComparisonRadarProps = {
  subjectFeatures: number[] | null; // null = no subject analyzed yet
  referenceFeatures?: number[];     // defaults to the "healthy" average
};

// ------------------------------------------------------------
// Converts one variable's value + its axis index into an (x, y)
// point on the SVG canvas. This is the trigonometry step:
// - `angle` places each of the 4 axes evenly around a circle
//   (360° / 4 = 90° apart), starting from the top.
// - `radius` maps a raw value (e.g. -3 to 3) to a distance from
//   the center (0 to MAX_RADIUS). We shift the range so that
//   -3 → close to center, +3 → far edge.
// ------------------------------------------------------------
function toPoint(value: number, index: number, total: number): [number, number] {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2; // start at top
  const normalized = (value + VALUE_RANGE) / (VALUE_RANGE * 2); // 0..1
  const radius = normalized * MAX_RADIUS;
  const x = CENTER + radius * Math.cos(angle);
  const y = CENTER + radius * Math.sin(angle);
  return [x, y];
}

function pointsToPolygon(values: number[]): string {
  return values
    .map((v, i) => toPoint(v, i, values.length).join(','))
    .join(' ');
}

export function ComparisonRadar({
  subjectFeatures,
  referenceFeatures = [0, 0, 0, 0],
}: ComparisonRadarProps) {
  if (!subjectFeatures) {
    return (
      <p style={{ color: colors.textDim, fontFamily: 'Space Mono, monospace', fontSize: '13px' }}>
        Nothing to compare yet — analyze a subject first.
      </p>
    );
  }

  // Grid rings at 25%, 50%, 75%, 100% of max radius — just visual
  // reference circles, not tied to any data.
  const gridRings = [0.25, 0.5, 0.75, 1];

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <svg width={SIZE} height={SIZE + 20} viewBox={`0 0 ${SIZE} ${SIZE + 20}`}>
        {/* Grid rings */}
        {gridRings.map((r) => (
          <circle
            key={r}
            cx={CENTER}
            cy={CENTER}
            r={MAX_RADIUS * r}
            fill="none"
            stroke={colors.border}
            strokeWidth={1}
          />
        ))}

        {/* Axis lines + labels */}
        {VARIABLE_LABELS.map((label, i) => {
          const [x, y] = toPoint(VALUE_RANGE, i, VARIABLE_LABELS.length); // edge point
          return (
            <g key={label}>
              <line x1={CENTER} y1={CENTER} x2={x} y2={y} stroke={colors.border} strokeWidth={1} />
              <text
                x={x}
                y={y > CENTER ? y + 14 : y - 6}
                textAnchor="middle"
                fontFamily="Space Mono, monospace"
                fontSize="10"
                fill={colors.textDim}
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Reference group polygon (the "healthy" average) */}
        <polygon
          points={pointsToPolygon(referenceFeatures)}
          fill={colors.textDim}
          fillOpacity={0.15}
          stroke={colors.textDim}
          strokeWidth={1.5}
        />

        {/* Subject polygon */}
        <polygon
          points={pointsToPolygon(subjectFeatures)}
          fill={colors.cyan}
          fillOpacity={0.2}
          stroke={colors.cyan}
          strokeWidth={2}
          style={{ filter: `drop-shadow(0 0 4px ${colors.cyan})` }}
        />
      </svg>
    </div>
  );
}
