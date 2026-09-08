import { createFileRoute } from '@tanstack/react-router';
import PortfolioJourney from '../components/portfolio-journey/PortfolioJourney';

function Index() {
  return <PortfolioJourney />;
}

export const Route = createFileRoute('/')({
  component: Index,
});
