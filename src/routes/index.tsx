import { createFileRoute } from '@tanstack/react-router';
import Hero from '../components/hero/hero';

function Index() {
  return (
    <>
      <Hero />
    </>
  );
}

export const Route = createFileRoute('/')({
  component: Index,
});
