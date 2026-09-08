// Approved portfolio renderer; lifecycle is owned by the React route.
export default function initialize(state, on) {
  state.styleProfiles = {
    cel: {
      label: 'Daylight (cel)',
      spring: '/portfolio-assets/cel-spring.webp',
      earth: '/portfolio-assets/cel-earth.webp',
      desktop: '/portfolio-assets/cel-desktop.webp',
      portrait: '/portfolio-assets/cel-portrait.webp',
      thumb: '/portfolio-assets/cel-thumb.webp',
    },
    evening: {
      label: 'Evening (cel)',
      spring: '/portfolio-assets/evening-spring.webp',
      earth: '/portfolio-assets/evening-earth.webp',
      desktop: '/portfolio-assets/evening-desktop.webp',
      portrait: '/portfolio-assets/evening-portrait.webp',
      thumb: '/portfolio-assets/evening-thumb.webp',
    },
    current: {
      label: 'Cinematic study',
      spring: '/portfolio-assets/current-spring.webp',
      earth: '/portfolio-assets/current-earth.webp',
      desktop: '/portfolio-assets/current-desktop.webp',
      portrait: '/portfolio-assets/current-portrait.webp',
      thumb: '/portfolio-assets/current-thumb.webp',
    },
    book: {
      label: 'Storybook study',
      spring: '/portfolio-assets/book-spring.webp',
      earth: '/portfolio-assets/book-earth.webp',
      desktop: '/portfolio-assets/book-desktop.webp',
      portrait: '/portfolio-assets/book-portrait.webp',
      thumb: '/portfolio-assets/book-thumb.webp',
    },
  };
  // Uses the visitor's local clock, not the server timezone.
  state.portfolioStyleForTime = (date = new Date()) =>
    date.getHours() >= 17 || date.getHours() < 6 ? 'evening' : 'cel';
}
