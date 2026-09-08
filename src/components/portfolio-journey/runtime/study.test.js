import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import initialize from './study.js';
import profiles from './style-profiles.js';
import markup from '../portfolio.html?raw';

let cleanups,
  observerCallbacks,
  state,
  pending,
  water,
  resizeHandlers,
  sceneWidth;
const settle = async () => {
  for (let i = 0; i < 8; i++) await Promise.resolve();
};
beforeEach(() => {
  vi.useFakeTimers();
  history.replaceState({}, '', '/?style=cel');
  document.body.innerHTML = markup;
  cleanups = [];
  observerCallbacks = [];
  pending = new Map();
  resizeHandlers = [];
  sceneWidth = 1200;
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    () => new DOMRect(0, 0, sceneWidth, 900)
  );
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(900);
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(3420);
  vi.stubGlobal('matchMedia', () => ({ matches: false }));
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback) {
        observerCallbacks.push(callback);
      }
      observe() {}
      disconnect() {}
    }
  );
  water = {
    available: true,
    update: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
  };
  state = {
    createNaturalWater: () => water,
    portfolioArtLoader: {
      load(src) {
        if (!pending.has(src)) {
          let resolve;
          const promise = new Promise((done) => {
            resolve = done;
          });
          pending.set(src, { promise, resolve });
        }
        return pending.get(src).promise;
      },
    },
  };
  profiles(state);
  initialize(state, (_target, type, handler) => {
    if (type === 'pagehide') cleanups.push(handler);
    if (type === 'resize') resizeHandlers.push(handler);
  });
});
afterEach(() => {
  cleanups.forEach((fn) => fn());
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});
describe('Portfolio runtime regressions', () => {
  const resolve = async (name) => {
    const src = '/portfolio-assets/' + name + '.webp';
    pending.get(src).resolve({ src });
    await settle();
  };
  const resize = (width) => {
    sceneWidth = width;
    resizeHandlers.forEach((fn) => fn());
  };
  const initialFrames = async () => {
    await resolve('cel-spring');
    await resolve('cel-desktop');
  };
  it('cancels an obsolete portrait request when resizing back to the committed desktop', async () => {
    await initialFrames();
    resize(390);
    resize(1200);
    await resolve('cel-portrait');
    expect(document.getElementById('frame').getAttribute('src')).toBe(
      '/portfolio-assets/cel-desktop.webp'
    );
  });
  it('rechecks orientation after every forest decode during an atomic style switch', async () => {
    await initialFrames();
    state.portfolioJourney.setStyle('book');
    resize(390);
    await resolve('book-spring');
    await resolve('book-earth');
    await resolve('book-desktop');
    expect(pending.has('/portfolio-assets/book-portrait.webp')).toBe(true);
    resize(1200);
    await resolve('book-portrait');
    expect(document.getElementById('study').dataset.style).toBe('book');
    expect(document.getElementById('frame').getAttribute('src')).toBe(
      '/portfolio-assets/book-desktop.webp'
    );
    expect(document.getElementById('near-frame').getAttribute('src')).toBe(
      '/portfolio-assets/book-desktop.webp'
    );
  });
  it('restores an in-flight forest when a new style is selected then cancelled', async () => {
    pending
      .get('/portfolio-assets/cel-spring.webp')
      .resolve({ src: '/portfolio-assets/cel-spring.webp' });
    await settle();
    expect(pending.has('/portfolio-assets/cel-desktop.webp')).toBe(true);
    state.portfolioJourney.setStyle('book');
    state.portfolioJourney.setStyle('cel');
    pending
      .get('/portfolio-assets/cel-desktop.webp')
      .resolve({ src: '/portfolio-assets/cel-desktop.webp' });
    await settle();
    expect(document.getElementById('study').dataset.forestReady).toBe('true');
    expect(document.getElementById('frame').getAttribute('src')).toBe(
      '/portfolio-assets/cel-desktop.webp'
    );
    expect(document.getElementById('near-frame').getAttribute('src')).toBe(
      '/portfolio-assets/cel-desktop.webp'
    );
  });
  it('releases renderers after React has removed the DOM and ignores queued observers', () => {
    document.body.replaceChildren();
    expect(() => cleanups.forEach((fn) => fn())).not.toThrow();
    cleanups = [];
    expect(water.dispose).toHaveBeenCalledTimes(1);
    expect(() =>
      observerCallbacks.forEach((fn) =>
        fn([
          { isIntersecting: false, intersectionRect: { width: 0, height: 0 } },
        ])
      )
    ).not.toThrow();
  });
});
