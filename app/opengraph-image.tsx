import 'server-only';
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
          background: '#0B101B',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'sans-serif',
          border: '16px solid #1E293B',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#2DD4BF',
              color: '#0B101B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: '900',
            }}
          >
            H
          </div>
          <span style={{ fontSize: '36px', fontWeight: '800', color: '#F8FAFC', letterSpacing: '-0.03em' }}>
            Huddle
          </span>
          <div
            style={{
              marginLeft: '24px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: '#1E293B',
              color: '#CBD5E1',
              fontSize: '18px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            COLLEGE PARK, MD
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1
            style={{
              fontSize: '64px',
              fontWeight: '900',
              color: '#F8FAFC',
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              margin: 0,
              maxWidth: '900px',
            }}
          >
            See what's happening around campus. Right now.
          </h1>
          <p style={{ fontSize: '28px', color: '#CBD5E1', margin: 0, fontWeight: '500' }}>
            Events, pickup games, and student meetups. Browse without an account.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '2px solid #1E293B',
            paddingTop: '24px',
          }}
        >
          <span style={{ fontSize: '20px', color: '#CBD5E1', fontWeight: '600', textTransform: 'uppercase' }}>
            huddlemap.live
          </span>
          <span style={{ fontSize: '20px', color: '#FB923C', fontWeight: '700' }}>
            Explore the map →
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
