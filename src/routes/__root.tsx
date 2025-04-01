import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import Navigation from '../components/navigation/Navigation';
import ThemeWrapper from '../components/theme-wrapper/ThemeWrapper';

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="absolute z-10 w-full">
        <Navigation />
      </header>
      <ThemeWrapper>
        <main>
          <Outlet />
        </main>
        <footer className="bg-slate-100 dark:bg-slate-950">
          <div className="p-4 text-center">
            &copy; {new Date().getFullYear()} Alek Racz Portfolio
          </div>
        </footer>
      </ThemeWrapper>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  ),
});
