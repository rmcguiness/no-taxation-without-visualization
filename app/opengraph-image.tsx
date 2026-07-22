import { ImageResponse } from 'next/og';
import { BRAND, SITE_NAME, SITE_TAGLINE } from '@/lib/site';

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Social share card: wordmark, title, tagline, and a bar-chart motif footer. */
export default function OpengraphImage() {
  // Heights echo a real part-to-whole spread, not decorative noise.
  const bars = [72, 100, 58, 84, 40, 66, 30, 50];

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
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 5,
            padding: 12,
            background: BRAND.accent,
            borderRadius: 12,
          }}
        >
          <div style={{ width: 10, height: 16, background: BRAND.paper, borderRadius: 2 }} />
          <div style={{ width: 10, height: 26, background: BRAND.paper, borderRadius: 2 }} />
          <div style={{ width: 10, height: 36, background: BRAND.paper, borderRadius: 2 }} />
        </div>
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>NTwV</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 940 }}>
        <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
          {SITE_NAME}
        </div>
        <div style={{ fontSize: 30, lineHeight: 1.35, color: '#52514e' }}>{SITE_TAGLINE}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 110 }}>
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              width: 108,
              height: h,
              background: i % 2 === 0 ? BRAND.accent : BRAND.accentDark,
              borderRadius: '4px 4px 0 0',
              opacity: 0.9,
            }}
          />
        ))}
      </div>
    </div>,
    { ...size },
  );
}
