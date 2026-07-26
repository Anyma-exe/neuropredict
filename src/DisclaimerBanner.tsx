import React from 'react';
import { colors, fonts } from './theme';

// Always-visible reminder that this tool is educational only.
export function DisclaimerBanner() {
  return (
    <div style={{
      background: colors.pink,
      color: colors.text,
      padding: '8px 16px',
      fontSize: '13px',
      fontFamily: fonts.mono,
      textAlign: 'center',
      letterSpacing: '0.05em',
    }}>
      EDUCATIONAL TOOL — SIMULATED DATA — NOT FOR DIAGNOSTIC USE
    </div>
  );
}
