import React from 'react';
import { colors, fonts } from './theme';

const VARIABLES = [
  { key: 'speed', label: 'Processing speed' },
  { key: 'memory', label: 'Working memory' },
  { key: 'inhibition', label: 'Inhibition' },
  { key: 'flexibility', label: 'Cognitive flexibility' },
];

type SliderProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

function Slider({ label, value, onChange }: SliderProps) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: fonts.mono,
        fontSize: '12px',
        color: colors.text,
        marginBottom: '4px',
      }}>
        <span>{label}</span>
        <span style={{ color: colors.cyan, textShadow: `0 0 4px ${colors.cyan}` }}>
          {value.toFixed(1)}
        </span>
      </div>
      <input
        type="range"
        min="-3"
        max="3"
        step="0.1"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: colors.pink }}
      />
    </div>
  );
}

type SubjectPanelProps = {
  values: Record<string, number>;
  onChange: (key: string, value: number) => void;
  onRandomize: () => void;
  onAnalyze: () => void;
};

export function SubjectPanel({ values, onChange, onRandomize, onAnalyze }: SubjectPanelProps) {
  return (
    <div>
      {VARIABLES.map((v) => (
        <Slider
          key={v.key}
          label={v.label}
          value={values[v.key]}
          onChange={(newVal) => onChange(v.key, newVal)}
        />
      ))}
      <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
        <button
          onClick={onRandomize}
          style={{
            fontFamily: fonts.mono,
            fontSize: '12px',
            padding: '8px 14px',
            background: 'transparent',
            color: colors.text,
            border: `1px solid ${colors.border}`,
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          Randomize
        </button>
        <button
          onClick={onAnalyze}
          style={{
            fontFamily: fonts.mono,
            fontSize: '12px',
            padding: '8px 14px',
            background: colors.pink,
            color: colors.text,
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          Analyze this profile
        </button>
      </div>
    </div>
  );
}
