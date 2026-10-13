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
  sceneWidth,
  sceneHeight,
  journeyTop,
  aboutTop,
  media;
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
  sceneHeight = 900;
  journeyTop = 0;
  aboutTop = 0;
  media = {};
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    function () {
      const top =
        this.id === 'journey'
          ? journeyTop
          : this.classList.contains('about-layout')
            ? aboutTop
            : 0;
      return new DOMRect(0, top, sceneWidth, sceneHeight);
    }
  );
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(
    () => sceneHeight
  );
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(3420);
  vi.stubGlobal('matchMedia', (query) => (media[query] ??= { matches: false }));
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
          let resolve, reject;
          const promise = new Promise((done, fail) => {
            resolve = done;
            reject = fail;
          });
          pending.set(src, { promise, resolve, reject });
        }
        return pending.get(src).promise;
      },
    },
  };
  profiles(state);
  initialize(state, (target, type, handler) => {
    if (type === 'pagehide') cleanups.push(handler);
    if (type === 'resize') resizeHandlers.push(handler);
    if (type === 'click') target.addEventListener('click', handler);
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
  it('does not repeat playback updates when visibility and motion state are unchanged', () => {
    water.update.mockClear();
    for (let i = 0; i < 20; i++)
      observerCallbacks.forEach((fn) =>
        fn([
          {
            isIntersecting: true,
            intersectionRect: { width: 1200, height: 900 },
          },
        ])
      );
    expect(water.update).not.toHaveBeenCalled();
    observerCallbacks[0]([
      { isIntersecting: false, intersectionRect: { width: 0, height: 0 } },
    ]);
    expect(water.update).toHaveBeenCalledTimes(1);
    expect(water.update.mock.calls[0][0]).toBe(false);
  });
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
  it('finishes the first artwork when a style switch made during it fails', async () => {
    state.portfolioJourney.setStyle('book');
    pending
      .get('/portfolio-assets/book-spring.webp')
      .reject(new Error('offline'));
    await settle();
    const notice = document.getElementById('artwork-status');
    expect(notice.dataset.error).toBe('true');
    await initialFrames();
    const study = document.getElementById('study');
    expect(study.dataset.style).toBe('cel');
    expect(study.dataset.springReady).toBe('true');
    expect(study.dataset.forestReady).toBe('true');
    expect(document.getElementById('spring').getAttribute('src')).toBe(
      '/portfolio-assets/cel-spring.webp'
    );
    // The failed switch stays visible with its retry, even after the
    // background underground load completes.
    vi.advanceTimersByTime(600);
    await resolve('cel-earth');
    expect(study.dataset.earthReady).toBe('true');
    expect(notice.hidden).toBe(false);
    expect(notice.dataset.error).toBe('true');
    expect(document.getElementById('artwork-retry').hidden).toBe(false);
  });
  it("keeps a failed style switch's Retry when the underground then fails too", async () => {
    state.portfolioJourney.setStyle('book');
    pending
      .get('/portfolio-assets/book-spring.webp')
      .reject(new Error('offline'));
    await settle();
    await initialFrames();
    vi.advanceTimersByTime(600);
    pending
      .get('/portfolio-assets/cel-earth.webp')
      .reject(new Error('offline'));
    await settle();
    const notice = document.getElementById('artwork-status');
    expect(notice.dataset.error).toBe('true');
    // Retry still repeats the style switch, not the underground load.
    document.getElementById('artwork-retry').click();
    expect(document.getElementById('artwork-message').textContent).toBe(
      'Loading ' + state.styleProfiles.book.label.toLowerCase() + '…'
    );
  });
  it('offers Retry for an underground failure after an earlier failure was retried', async () => {
    await initialFrames();
    resize(390);
    pending
      .get('/portfolio-assets/cel-portrait.webp')
      .reject(new Error('offline'));
    await settle();
    pending.delete('/portfolio-assets/cel-portrait.webp');
    document.getElementById('artwork-retry').click();
    await resolve('cel-portrait');
    const notice = document.getElementById('artwork-status');
    expect(notice.hidden).toBe(true);
    vi.advanceTimersByTime(600);
    pending
      .get('/portfolio-assets/cel-earth.webp')
      .reject(new Error('offline'));
    await settle();
    expect(notice.hidden).toBe(false);
    expect(document.getElementById('artwork-retry').hidden).toBe(false);
  });
  it('cuts to the closed forest at the Forest chapter when motion is reduced', () => {
    vi.stubGlobal('scrollTo', vi.fn());
    const chapter = (name) =>
      [...document.querySelectorAll('#chapters button')].find(
        (b) => b.textContent.trim() === name
      );
    const frame = document.getElementById('frame');
    document.getElementById('reduce').checked = true;
    journeyTop = -800;
    chapter('Forest').click();
    const forest = frame.style.transform;
    journeyTop = 0;
    chapter('Spring').click();
    expect(frame.style.transform).toBe('scale(4)');
    expect(forest).not.toBe(frame.style.transform);
  });
  it('lets the computed descent, not the CSS minimum, end the journey', () => {
    const journey = document.getElementById('journey');
    expect(journey.style.minHeight).toBe('0');
    expect(journey.style.height).toMatch(/px$/);
  });
  it('keeps the pace when touch browser bars move and re-paces a real resize under 160px', () => {
    const journey = document.getElementById('journey');
    const frame = document.getElementById('frame');
    media['(any-pointer: coarse)'].matches = true;
    journeyTop = -400;
    resizeHandlers.forEach((fn) => fn());
    const length = journey.style.height,
      transform = frame.style.transform;
    // The bars change the viewport, not the pinned 100svh scene.
    vi.stubGlobal('innerHeight', innerHeight - 84);
    resizeHandlers.forEach((fn) => fn());
    expect(journey.style.height).toBe(length);
    expect(frame.style.transform).toBe(transform);
    // A real resize changes the scene too.
    sceneHeight = 816;
    resizeHandlers.forEach((fn) => fn());
    const touchLength = journey.style.height;
    expect(touchLength).not.toBe(length);
    media['(any-pointer: coarse)'].matches = false;
    resizeHandlers.forEach((fn) => fn());
    expect(touchLength).toBe(journey.style.height);
  });
  it('marks About only once the About content reaches the middle of the view', () => {
    vi.stubGlobal('innerHeight', 800);
    journeyTop = -1e5;
    const marked = () => {
      resizeHandlers.forEach((fn) => fn());
      return document
        .querySelector('#chapters [aria-current]')
        .textContent.trim();
    };
    aboutTop = 900;
    expect(marked()).toBe('Underground');
    aboutTop = 401;
    expect(marked()).toBe('Underground');
    aboutTop = 399;
    expect(marked()).toBe('About');
  });
  it('shows the scroll cue as soon as the spring is painted', async () => {
    const hint = document.getElementById('scroll-hint');
    expect(hint.classList.contains('shown')).toBe(false);
    await resolve('cel-spring');
    expect(hint.classList.contains('shown')).toBe(true);
  });
  it('shows the scroll cue when a style switch replaces the first load', async () => {
    const hint = document.getElementById('scroll-hint');
    state.portfolioJourney.setStyle('book');
    await resolve('book-spring');
    await resolve('book-earth');
    await resolve('book-desktop');
    expect(document.getElementById('study').dataset.style).toBe('book');
    expect(hint.classList.contains('shown')).toBe(true);
  });
  it('still shows the scroll cue after one second when artwork is slow', () => {
    const hint = document.getElementById('scroll-hint');
    vi.advanceTimersByTime(999);
    expect(hint.classList.contains('shown')).toBe(false);
    vi.advanceTimersByTime(1);
    expect(hint.classList.contains('shown')).toBe(true);
  });
  it('travels to chapters with native smooth scrolling unless motion is reduced', () => {
    const scrollTo = vi.fn();
    vi.stubGlobal('scrollTo', scrollTo);
    const intro = document.querySelector('.about-layout');
    intro.scrollIntoView = vi.fn();
    const chapter = (name) =>
      [...document.querySelectorAll('#chapters button')].find(
        (b) => b.textContent.trim() === name
      );
    chapter('Forest').click();
    expect(scrollTo).toHaveBeenLastCalledWith(
      expect.objectContaining({ behavior: 'smooth' })
    );
    chapter('About').click();
    expect(intro.scrollIntoView).toHaveBeenLastCalledWith({
      behavior: 'smooth',
    });
    document.getElementById('reduce').checked = true;
    chapter('Spring').click();
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: 'instant' });
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
