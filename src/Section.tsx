import React from 'react';
import { colors, fonts } from './theme';

// Generic card wrapper for a screen "section" — takes a step
// number, a title, and its content (children).
type SectionProps = {
  step: string;
  title: string;
  children: React.ReactNode;
};

export function Section({ step, title, children }: SectionProps) {
  return (
    <section style={{
      background: colors.panel,
      border: `1px solid ${colors.border}`,
      borderRadius: '4px',
      padding: '24px',
      marginBottom: '20px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '10px',
        marginBottom: '16px',
      }}>
        <span style={{
          fontFamily: fonts.mono,
          color: colors.cyan,
          fontSize: '13px',
          textShadow: `0 0 6px ${colors.cyan}`,
        }}>
          {step}
        </span>
        <h2 style={{
          fontFamily: fonts.display,
          color: colors.text,
          fontSize: '24px',
          fontWeight: 400,
          margin: 0,
          letterSpacing: '0.02em',
        }}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
