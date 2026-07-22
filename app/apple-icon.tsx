import { ImageResponse } from 'next/og';
import { BRAND } from '@/lib/site';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Apple touch icon: the bar motif with breathing room for rounded masking. */
export default function AppleIcon() {
  const bars = [{ h: '38%' }, { h: '62%' }, { h: '88%' }];
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 16,
        padding: 46,
        background: BRAND.accent,
      }}
    >
      {bars.map((b, i) => (
        <div key={i} style={{ width: 30, height: b.h, background: BRAND.paper, borderRadius: 6 }} />
      ))}
    </div>,
    { ...size },
  );
}
