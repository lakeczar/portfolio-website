import { act, render, screen } from '@testing-library/react';
import {
  createMemoryHistory,
  createRoute,
  createRouter,
  Link,
  RouterProvider,
} from '@tanstack/react-router';
import { beforeEach, describe, expect, it } from 'vitest';
import { Route as rootRoute } from '../routes/__root';

const canonical = () =>
  document.querySelector('link[rel="canonical"]')?.getAttribute('href');
const shareUrl = () =>
  document.querySelector('meta[property="og:url"]')?.getAttribute('content');

beforeEach(() => {
  // As GitHub Pages serves /about/ (scripts/pages-routes.mjs).
  document.head.innerHTML = `
    <link rel="canonical" href="https://alekracz.dev/about/" />
    <meta property="og:url" content="https://alekracz.dev/about/" />`;
});

describe('Root layout', () => {
  it('keeps the canonical and share URLs on the current route after in-app navigation', async () => {
    const routeTree = rootRoute.addChildren([
      createRoute({
        getParentRoute: () => rootRoute,
        path: '/',
        component: () => <p>Home page</p>,
      }),
      createRoute({
        getParentRoute: () => rootRoute,
        path: '/about',
        component: () => <Link to="/">Return home</Link>,
      }),
    ]);
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: ['/about/'] }),
    });
    render(<RouterProvider router={router} />);
    await act(async () => {
      (await screen.findByText('Return home')).click();
    });
    await screen.findByText('Home page');
    expect(canonical()).toBe('https://alekracz.dev/');
    expect(shareUrl()).toBe('https://alekracz.dev/');
    await act(() => router.navigate({ to: '/about' }));
    expect(canonical()).toBe('https://alekracz.dev/about/');
    expect(shareUrl()).toBe('https://alekracz.dev/about/');
  });
});
