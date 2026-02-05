import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Theme } from '@radix-ui/themes';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Theme appearance="light" accentColor="indigo">
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </Theme>
  );
}
