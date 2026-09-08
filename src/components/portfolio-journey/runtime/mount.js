import profiles from './style-profiles.js';
import artwork from './art-loader.js';
import water from './natural-water.js';
import gesture from './gesture-rig.js';
import journey from './study.js';
import studio from './site-controls.js';

// The reviewed visual renderer owns one DOM subtree, not React's tree or global
// event prototypes. Every listener is released on route changes / StrictMode.
export function mountPortfolio(host) {
  const state = {};
  const controller = new AbortController();
  const cleanups = [];
  let disposed = false;
  const on = (target, type, handler, options = {}) => {
    if (type === 'pagehide') cleanups.push(handler);
    else
      target.addEventListener(type, handler, {
        ...(typeof options === 'boolean' ? { capture: options } : options),
        signal: controller.signal,
      });
  };
  function dispose() {
    if (disposed) return;
    disposed = true;
    controller.abort();
    // Keep the DOM present while renderers release media and GPU resources.
    for (const cleanup of cleanups.reverse()) cleanup();
    if (window.portfolioJourney === state.portfolioJourney)
      delete window.portfolioJourney;
  }
  try {
    for (const initialize of [
      profiles,
      artwork,
      water,
      gesture,
      journey,
      studio,
    ])
      initialize(state, on);
    host.querySelector('[data-copyright-year]').textContent = String(
      new Date().getFullYear()
    );
    window.portfolioJourney = state.portfolioJourney;
    // A persisted page remains mounted when restored from the back/forward cache.
    window.addEventListener(
      'pagehide',
      (event) => {
        if (!event.persisted) dispose();
      },
      { signal: controller.signal }
    );
    return dispose;
  } catch (error) {
    dispose();
    throw error;
  }
}
