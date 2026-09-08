import { createFileRoute, Link } from '@tanstack/react-router';

function About() {
  return (
    <section className="route-page" aria-labelledby="about-title">
      <div className="route-page-copy">
        <p className="route-kicker">About</p>
        <h1 id="about-title">I build software and the systems behind it.</h1>
        <p>
          My work spans interactive web experiences, self-hosted infrastructure,
          and practical ways for people and agents to build together.
        </p>
        <Link className="route-return-link" to="/">
          Return home
        </Link>
      </div>
    </section>
  );
}

export const Route = createFileRoute('/about')({
  component: About,
});
