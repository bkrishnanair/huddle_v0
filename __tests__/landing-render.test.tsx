import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
const auth = vi.hoisted(() => vi.fn());
vi.mock('@/lib/firebase-context', () => ({useAuth: auth}));
vi.mock('next/navigation', () => ({useRouter: () => ({push: vi.fn()})}));
vi.mock('@/components/landing-page', () => ({default: () => <main>Public campus discovery</main>}));
vi.mock('@/components/auth-screen', () => ({default: () => <div>Sign in</div>}));
import Home from '@/app/page';

describe('public landing does not wait for authentication', () => {
  it.each([{user: null, loading: true, error: null}, {user: null, loading: false, error: 'offline'}])('renders marketing content when auth is %j', state => {
    auth.mockReturnValue(state);
    expect(renderToStaticMarkup(<Home />)).toContain('Public campus discovery');
  });
});
