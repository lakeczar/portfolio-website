// Approved portfolio renderer; lifecycle is owned by the React route.
export default function initialize(state, on) {
  let cleanups = [];
  state.portfolioGestureSettings = {
    fadeIn: 0.4,
    fadeOut: 0.4,
    speed: 1.75,
    hold: 0.05,
    rest: 1.5,
    opacity: 1,
  };
  function mountVideo(host) {
    host.innerHTML =
      '<video class="gesture-video" muted playsinline preload="auto" poster="/portfolio-assets/scroll-hand-selected.png" aria-hidden="true"><source src="/portfolio-assets/scroll-hand-selected.mp4" type="video/mp4"></video>';
    const video = host.querySelector('video'),
      hint = host.closest('.scroll-hint');
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const settings = state.portfolioGestureSettings;
    let timer = 0,
      phase = 'idle',
      disposed = false;
    video.muted = true;
    function configure() {
      video.defaultPlaybackRate = settings.speed;
      video.playbackRate = settings.speed;
      hint.style.setProperty('--gesture-opacity', settings.opacity);
      clearTimeout(timer);
      phase = 'idle';
      video.pause();
      video.currentTime = 0;
      sync();
    }
    video.defaultPlaybackRate = settings.speed;
    video.playbackRate = settings.speed;
    const later = (fn, ms) => {
      clearTimeout(timer);
      timer = setTimeout(fn, ms);
    };
    function sync() {
      if (disposed) return;
      const reduced =
        preference.matches || !!host.closest('[data-reduced="true"]');
      const scrub = host.closest('[data-scrub="true"]');
      const active =
        hint.classList.contains('shown') &&
        !document.hidden &&
        !host.closest('[hidden]');
      const paused = !!host.closest('[data-paused="true"]');
      if (reduced || !active) {
        clearTimeout(timer);
        phase = 'idle';
        video.pause();
        video.currentTime = 0;
        video.style.opacity = '1';
        return;
      }
      if (scrub) {
        clearTimeout(timer);
        phase = 'idle';
        video.pause();
        const seconds = Math.abs(
          parseFloat(
            getComputedStyle(scrub).getPropertyValue('--gesture-offset')
          ) || 0
        );
        video.currentTime = Math.min(seconds, video.duration || 3);
        video.style.opacity = '1';
        return;
      }
      if (paused) {
        clearTimeout(timer);
        video.pause();
        phase = 'idle';
        return;
      }
      if (phase === 'idle') {
        if (video.ended) video.currentTime = 0;
        phase = 'entering';
        video.style.transitionDuration = settings.fadeIn + 's';
        video.style.opacity = '1';
        later(() => {
          phase = 'playing';
          video.play().catch(() => {
            phase = 'idle';
          });
        }, settings.fadeIn * 1000);
      }
    }
    function ended() {
      phase = 'rest';
      later(() => {
        video.style.transitionDuration = settings.fadeOut + 's';
        video.style.opacity = '0';
        later(() => {
          video.currentTime = 0;
          later(() => {
            phase = 'idle';
            sync();
          }, settings.rest * 1000);
        }, settings.fadeOut * 1000);
      }, settings.hold * 1000);
    }
    on(video, 'ended', ended);
    on(video, 'loadeddata', sync);
    on(document, 'visibilitychange', sync);
    on(document, 'gesture-scrub', sync);
    on(document, 'gesture-settings-change', configure);
    on(preference, 'change', sync);
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      subtree: true,
      attributes: true,
      attributeFilter: [
        'class',
        'hidden',
        'data-reduced',
        'data-paused',
        'data-scrub',
      ],
    });
    sync();
    const dispose = () => {
      disposed = true;
      clearTimeout(timer);
      video.pause();
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      document.removeEventListener('gesture-scrub', sync);
      document.removeEventListener('gesture-settings-change', configure);
      preference.removeEventListener('change', sync);
      video.removeEventListener('ended', ended);
      video.removeEventListener('loadeddata', sync);
    };
    cleanups.push(dispose);
  }
  state.mountPortfolioGesture = mountVideo;
  state.setGestureMode = () => {
    cleanups.forEach((fn) => fn());
    cleanups = [];
    document.querySelectorAll('.gesture-touch').forEach(mountVideo);
  };
  state.setGestureMode();
  on(globalThis, 'pagehide', () => {
    cleanups.forEach((fn) => fn());
    cleanups = [];
  });
}
