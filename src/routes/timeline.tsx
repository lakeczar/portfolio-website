import { createFileRoute, Link } from '@tanstack/react-router';

function Timeline() {
  return (
    <section className="route-page" aria-labelledby="timeline-title">
      <div className="route-page-copy">
        <p className="route-kicker">Timeline</p>
        <h1 id="timeline-title">The project record is still taking shape.</h1>
        <p>
          The selected work on the home page is the current view. A fuller,
          evidence-backed timeline will follow as the projects are documented.
        </p>
        <Link className="route-return-link" to="/">
          Return home
        </Link>
      </div>
    </section>
  );
}

export const Route = createFileRoute('/timeline')({
  component: Timeline,
});
