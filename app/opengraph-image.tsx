import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Huddle — The Live Map for Campus Events';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#FCFBF9',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'sans-serif',
          border: '16px solid #E9E6E0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#1D4FD7',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: '900',
            }}
          >
            H
          </div>
          <span style={{ fontSize: '36px', fontWeight: '800', color: '#191C1E', letterSpacing: '-0.03em' }}>
            Huddle
          </span>
          <div
            style={{
              marginLeft: '24px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: '#DCF5E8',
              color: '#0BA95B',
              fontSize: '18px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            ● LIVE AT UMD
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1
            style={{
              fontSize: '64px',
              fontWeight: '900',
              color: '#191C1E',
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              margin: 0,
              maxWidth: '900px',
            }}
          >
            See what's happening around campus. Right now.
          </h1>
          <p style={{ fontSize: '28px', color: '#43484D', margin: 0, fontWeight: '500' }}>
            Live events, pickup games, and student meetups — no app, no account required.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '2px solid #E9E6E0',
            paddingTop: '24px',
          }}
        >
          <span style={{ fontSize: '20px', color: '#767D85', fontWeight: '600', textTransform: 'uppercase' }}>
            huddlemap.live
          </span>
          <span style={{ fontSize: '20px', color: '#1D4FD7', fontWeight: '700' }}>
            Open the Live Map →
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
