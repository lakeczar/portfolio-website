import { createFileRoute, redirect } from '@tanstack/react-router';

// Auto redirect to home for all non-matching paths
export const Route = createFileRoute('/$')({
  beforeLoad: async () => {
    return redirect({ to: '/' });
  },
});
