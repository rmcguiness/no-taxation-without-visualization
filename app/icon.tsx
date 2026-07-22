import { ImageResponse } from 'next/og';
import { BRAND } from '@/lib/site';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

/** Favicon: three ascending bars (the app's visualization motif) on brand teal. */
export default function Icon() {
  const bars = [{ h: '38%' }, { h: '62%' }, { h: '88%' }];
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 3,
        padding: 6,
        background: BRAND.accent,
        borderRadius: 6,
      }}
    >
      {bars.map((b, i) => (
        <div key={i} style={{ width: 6, height: b.h, background: BRAND.paper, borderRadius: 1 }} />
      ))}
    </div>,
    { ...size },
  );
}
