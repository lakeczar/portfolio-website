import {
  createRootRoute,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import Navigation from '../components/navigation/Navigation';

function RootLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
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
