import {
  createRootRoute,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { useEffect } from 'react';
import Navigation from '../components/navigation/Navigation';

// Each Pages entry file carries its route's canonical and share URL
// (scripts/pages-routes.mjs); keep them true after in-app navigation.
const site = 'https://alekracz.dev/';
function useCanonicalUrl(pathname: string) {
  useEffect(() => {
    const route = pathname.replace(/^\/+|\/+$/g, '');
    const url =
      site + (['about', 'timeline'].includes(route) ? route + '/' : '');
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute('content', url);
  }, [pathname]);
}

function RootLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  useCanonicalUrl(pathname);
  if (pathname === '/') return <Outlet />;
  return (
    <>
      <header className="site-header">
        <Navigation />
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>&copy; {new Date().getFullYear()} Alek Racz Portfolio</p>
      </footer>
    </>
  );
}
export const Route = createRootRoute({ component: RootLayout });
