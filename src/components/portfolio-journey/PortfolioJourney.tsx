import { useEffect, useRef } from 'react';
import markup from './portfolio.html?raw';
import styles from './portfolio.css?raw';
import { mountPortfolio } from './runtime/mount.js';

/** The approved scene remains a small imperative island inside the React route. */
export default function PortfolioJourney() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    // Studio moves controls inside this island; reset it on StrictMode remount.
    // This is a checked-in literal, never user input or fetched HTML.
    element.innerHTML = markup;
    const dispose = mountPortfolio(element);
    return () => {
      dispose();
      element.replaceChildren();
    };
  }, []);
  return (
    <>
      <style>{styles}</style>
      <div ref={host} dangerouslySetInnerHTML={{ __html: markup }} />
    </>
  );
}
