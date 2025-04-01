import { createFileRoute } from '@tanstack/react-router';

function Timeline() {
  return <div className="p-2">Hello from timeline!</div>;
}

export const Route = createFileRoute('/timeline')({
  component: Timeline,
});
