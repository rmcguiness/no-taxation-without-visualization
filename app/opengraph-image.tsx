import { ImageResponse } from 'next/og';
import { BRAND, SITE_NAME, SITE_TAGLINE } from '@/lib/site';

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Social share card: wordmark, title, tagline, and a bar-chart motif footer. */
export default function OpengraphImage() {
  // Text-only share card; no illustrative data.

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: BRAND.paper,
        color: BRAND.ink,
        padding: '72px 80px',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>NTwV</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 940 }}>
        <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
          {SITE_NAME}
        </div>
        <div style={{ fontSize: 30, lineHeight: 1.35, color: '#52514e' }}>{SITE_TAGLINE}</div>
      </div>

      <div
        style={{
          display: 'flex',
          borderTop: `2px solid ${BRAND.accent}`,
          paddingTop: 24,
          color: BRAND.accent,
          fontSize: 24,
        }}
      >
        The federal checkbook, made clear. · Public data. Open methods.
      </div>
    </div>,
    { ...size },
  );
}
