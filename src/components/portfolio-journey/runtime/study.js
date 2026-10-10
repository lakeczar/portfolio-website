import { descentPace, forestCurve, zoom } from './journey-pace.js';

// Approved portfolio renderer; lifecycle is owned by the React route.
export default function initialize(state, on) {
  'use strict';
  const root = document.getElementById('study');
  const scene = document.getElementById('scene');
  const journey = document.getElementById('journey');
  const requestedStyle = new URLSearchParams(location.search).get('style');
  let styleMode = Object.hasOwn(state.styleProfiles, requestedStyle)
    ? requestedStyle
    : 'auto';
  let profileId =
    styleMode === 'auto' ? state.portfolioStyleForTime() : styleMode;
  let profile = state.styleProfiles[profileId],
    styleTimer = 0;
  root.dataset.style = profileId;
  root.dataset.styleMode = styleMode;
  // Same thumbnail index.html preloads: a blurred stand-in until the spring decodes.
  scene.style.setProperty('--placeholder', `url(${profile.thumb})`);
  let portraitLayout = false,
    frameSource = '',
    frameRequest = 0,
    styleRequest = 0,
    pendingId = null,
    earthRequest = null,
    earthTimer = 0;
  const loader = state.portfolioArtLoader;
  const notice = document.getElementById('artwork-status'),
    noticeText = document.getElementById('artwork-message'),
    retry = document.getElementById('artwork-retry');
  let retryAction = null;
  function loading(text) {
    notice.hidden = false;
    noticeText.textContent = text;
    retry.hidden = true;
    notice.dataset.error = 'false';
    scene.setAttribute('aria-busy', 'true');
  }
  function loaded() {
    notice.hidden = true;
    retryAction = null;
    scene.setAttribute('aria-busy', 'false');
  }
  function failed(action) {
    notice.hidden = false;
    noticeText.textContent =
      'Artwork could not load. Your current scene is unchanged.';
    notice.dataset.error = 'true';
    retry.hidden = false;
    retryAction = action;
    scene.setAttribute('aria-busy', 'false');
  }
  on(retry, 'click', () => retryAction?.());
  root.dataset.forestReady = 'false';
  root.dataset.earthReady = 'false';
  function updateFrames() {
    const src = portraitLayout ? profile.portrait : profile.desktop;
    const request = ++frameRequest;
    if (src === frameSource) return Promise.resolve();
    return loader
      .load(src)
      .then((image) => {
        if (request !== frameRequest) return;
        for (const id of ['frame', 'near-frame'])
          document.getElementById(id).src = image.src;
        // Cache only a committed frame, never a request that can be invalidated.
        frameSource = src;
        root.dataset.forestReady = 'true';
        render(progress);
      })
      .catch((error) => {
        if (request === frameRequest) frameSource = '';
        throw error;
      });
  }
  function ensureEarth() {
    if (root.dataset.earthReady === 'true') return Promise.resolve();
    if (earthRequest) return earthRequest;
    const id = profileId,
      src = profile.earth;
    earthRequest = loader
      .load(src, 'low')
      .then((image) => {
        if (profileId !== id) return;
        document.getElementById('earth-image').src = image.src;
        root.dataset.earthReady = 'true';
        // Clear only its own notice, never another failure's Retry.
        if (
          !pendingId &&
          (notice.dataset.error !== 'true' || retryAction === ensureEarth)
        )
          loaded();
        render(progress);
      })
      .catch(() => {
        if (profileId === id) failed(ensureEarth);
      })
      .finally(() => {
        earthRequest = null;
      });
    return earthRequest;
  }
  // Quiet restarts keep a failed style switch's notice and retry on screen.
  async function startArtwork(quiet = false) {
    const token = ++styleRequest;
    if (!quiet) loading('Loading the spring…');
    try {
      const image = await loader.load(profile.spring, 'high');
      if (token !== styleRequest) return;
      const spring = document.getElementById('spring');
      spring.src = image.src;
      // The element decodes separately; fade the placeholder only once it can paint.
      await spring.decode?.().catch(() => {});
      if (token !== styleRequest) return;
      root.dataset.springReady = 'true';
      if (!quiet) loaded();
      // Cue scrolling as soon as there is a scene to scroll through.
      introduceHint();
      await updateFrames();
      if (token !== styleRequest) return;
      earthTimer = setTimeout(ensureEarth, 600);
    } catch {
      if (token === styleRequest) failed(startArtwork);
    }
  }
  async function switchArtwork(next) {
    const token = ++styleRequest;
    pendingId = next;
    clearTimeout(earthTimer);
    ++frameRequest;
    loading('Loading ' + state.styleProfiles[next].label.toLowerCase() + '…');
    try {
      const candidate = state.styleProfiles[next];
      const [spring, earth] = await Promise.all([
        loader.load(candidate.spring, 'high'),
        loader.load(candidate.earth),
        loader.load(portraitLayout ? candidate.portrait : candidate.desktop),
      ]);
      let forest, forestSource;
      // A resize can happen during decode. Commit only the current orientation,
      // and stop immediately when another style request replaces this one.
      do {
        if (token !== styleRequest) return;
        forestSource = portraitLayout ? candidate.portrait : candidate.desktop;
        forest = await loader.load(forestSource);
        if (token !== styleRequest) return;
      } while (
        forestSource !==
        (portraitLayout ? candidate.portrait : candidate.desktop)
      );
      profileId = next;
      profile = candidate;
      pendingId = null;
      frameSource = forestSource;
      document.getElementById('spring').src = spring.src;
      document.getElementById('earth-image').src = earth.src;
      for (const id of ['frame', 'near-frame'])
        document.getElementById(id).src = forest.src;
      root.dataset.springReady =
        root.dataset.forestReady =
        root.dataset.earthReady =
          'true';
      root.dataset.style = profileId;
      loaded();
      render(progress);
      // A switch can replace the first load, so it cues scrolling too.
      introduceHint();
      document.dispatchEvent(new Event('portfolio-style-change'));
    } catch {
      if (token === styleRequest) {
        pendingId = null;
        failed(() => switchArtwork(next));
        // The switch invalidated any unfinished load of the current style.
        if (root.dataset.springReady !== 'true') startArtwork(true);
        else updateFrames().catch(() => {});
      }
    }
  }
  const depth = document.getElementById('depth');
  const output = document.getElementById('depth-value');
  const play = document.getElementById('play');
  const still = document.getElementById('still');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const reducePreview = document.getElementById('reduce');
  const reducedMotion = () => reduced.matches || reducePreview.checked;
  const names = {
    natural: 'Natural flow',
    lively: 'Livelier flow',
    css: 'Previous drawn lines',
    svg: 'Drawn ripples',
    canvas: 'Surface shimmer',
  };
  const clamp = (v) => Math.max(0, Math.min(1, v));
  let disposed = false;
  let lastPlaybackState = '';
  let method = 'lively',
    requested = true,
    visible = true,
    surfaceVisible = true,
    progress = 0;
  const hint = document.getElementById('scroll-hint');
  const coarse = matchMedia('(any-pointer: coarse)');
  // Chapter dots and reduced motion treat the forest as arriving here.
  const forestChapter = 0.25;
  const forestEnd = 0.35,
    descentStart = forestEnd,
    bridgeHeight = 0.1,
    worldTravel = 1 + bridgeHeight;
  const tailPace = 1.6;
  // Forest layer scales from the spring to the deep forest, wide and tall crops.
  const scales = {
    vista: [1.3, 1],
    frame: { wide: [5, 1.14], tall: [4, 1] },
    near: { wide: [8, 1.65], tall: [6, 1.15] },
  };
  // The first scroll visibly moves the forest (relative to its average speed).
  const forestStartPace = 0.7;
  let baseTravel = 1,
    pace;
  function distanceAt(p) {
    if (p <= forestEnd) return baseTravel * p;
    // Inverse is only needed when seeking with the studio controls, not per frame.
    const target = clamp((p - forestEnd) / (1 - forestEnd)) * pace.pixels;
    let lo = 0,
      hi = pace.distance;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (pace.at(mid) < target) lo = mid;
      else hi = mid;
    }
    return baseTravel * forestEnd + (lo + hi) / 2;
  }
  function layoutPace() {
    journey.style.height = journey.style.minHeight = '';
    baseTravel = Math.max(1, journey.offsetHeight - innerHeight);
    const near = scales.near[portraitLayout ? 'tall' : 'wide'];
    pace = descentPace({
      height: scene.clientHeight,
      baseTravel,
      forestEnd,
      worldTravel,
      tailPace,
      nearZoom: Math.log(near[0] / near[1]),
    });
    // Size against the pinned scene (100svh), not innerHeight, so the sticky
    // release lines up with the end of the descent when mobile bars are hidden.
    journey.style.height =
      scene.clientHeight + baseTravel * forestEnd + pace.distance + 'px';
    // The CSS minimum only sizes the measurement above; the descent sets the end.
    journey.style.minHeight = '0';
  }
  const hintEnd = 0.85;
  let hintTimer = 0,
    initialHint = true;
  function revealHint() {
    hint.classList.toggle(
      'shown',
      visible && !document.hidden && progress < hintEnd
    );
  }
  function introduceHint() {
    if (initialHint) revealHint();
  }
  function restHint() {
    initialHint = false;
    clearTimeout(hintTimer);
    if (hint.classList.contains('shown')) hint.classList.remove('shown');
    if (progress < hintEnd) hintTimer = setTimeout(revealHint, 3200);
  }
  function layoutScene() {
    const rect = scene.getBoundingClientRect(),
      w = rect.width,
      h = rect.height;
    portraitLayout = w / h < 0.9;
    if (root.dataset.springReady === 'true' && !pendingId)
      updateFrames().catch(() => failed(() => updateFrames().then(loaded)));
    const artW = Math.max(w, (h * 1672) / 941),
      artH = (artW * 941) / 1672;
    scene.style.setProperty('--art-width', artW + 'px');
    scene.style.setProperty('--art-height', artH + 'px');
    scene.style.setProperty('--art-top', (h - artH) / 2 + 'px');
    root.dataset.touch = String(
      coarse.matches || innerWidth <= 900 || scene.classList.contains('phone')
    );
  }
  const naturalWater = state.createNaturalWater(
    document.getElementById('natural-water'),
    document.getElementById('spring')
  );
  const glints = [
    [38, 70, 8],
    [55, 70, 7],
    [42, 75, 11],
    [58, 77, 8],
    [33, 74, 7],
    [46, 81, 10],
    [63, 73, 6],
    [43, 78, 8],
  ];
  glints.forEach(([x, y, w], i) => {
    const n = document.createElement('i');
    n.className = 'glint';
    Object.assign(n.style, {
      left: x + '%',
      top: y + '%',
      width: w + '%',
      animationDuration: 3.5 + i * 0.35 + 's',
      animationDelay: -i * 1.7 + 's',
    });
    document.getElementById('css-pond').append(n);
  });
  for (let i = 0; i < 12; i++) {
    const n = document.createElement('i');
    n.className = 'fall-stream';
    Object.assign(n.style, {
      left: 3 + i * 8 + '%',
      animationDuration: 1.1 + (i % 4) * 0.2 + 's',
      animationDelay: -i * 0.27 + 's',
    });
    root.querySelector('.fall-mask').append(n);
  }
  for (let i = 0; i < 3; i++) {
    const n = document.createElement('i');
    n.className = 'css-ripple';
    n.style.animationDelay = (-i * 4.6) / 3 + 's';
    document.getElementById('css-pond').append(n);
  }
  function active() {
    return (
      requested &&
      !reducedMotion() &&
      !document.hidden &&
      visible &&
      surfaceVisible &&
      !still.checked
    );
  }
  function sync() {
    if (disposed) return;
    const run = active();
    const reducedState = reducedMotion();
    if (
      (!visible || document.hidden || progress >= hintEnd) &&
      hint.classList.contains('shown')
    )
      hint.classList.remove('shown');
    // Scroll position changes do not usually change playback. Avoid notifying
    // the hand's observers and restarting hidden media on every scroll frame.
    const playbackState = [
      run,
      reducedState,
      method,
      requested,
      still.checked,
      naturalWater.available,
    ].join('|');
    if (playbackState === lastPlaybackState) return;
    lastPlaybackState = playbackState;
    root.dataset.running = String(run && method === 'css');
    root.dataset.reduced = String(reducedState);
    naturalWater.update(
      run,
      (method === 'natural' || method === 'lively') &&
        !still.checked &&
        !reducedMotion(),
      method === 'lively' ? 1.7 : 1
    );
    play.disabled = reducedMotion();
    play.textContent = reducedMotion()
      ? 'Reduced motion'
      : requested
        ? 'Pause water'
        : 'Play water';
    play.setAttribute('aria-pressed', String(requested && !reducedMotion()));
    document.getElementById('status').textContent =
      names[method] +
      '. ' +
      (!naturalWater.available && method !== 'css'
        ? 'Water enhancement unavailable; showing the still artwork.'
        : reducedMotion()
          ? 'Static view follows reduced motion.'
          : still.checked
            ? 'Original still image.'
            : run
              ? 'Moving reflections, falling water, and inflow.'
              : requested
                ? 'Water paused while out of view.'
                : 'Water is paused.');
  }
  function render(p) {
    if (disposed) return;
    progress = clamp(p);
    depth.value = (progress * 100).toFixed(1);
    output.value = Math.round(progress * 100) + '%';
    const enclosure = forestCurve(
      progress / forestEnd,
      forestStartPace,
      pace.forestEndPace
    );
    const crop = portraitLayout ? 'tall' : 'wide';
    if (progress > 0.12 && !pendingId) ensureEarth();
    const descent =
      root.dataset.earthReady === 'true'
        ? clamp((progress - descentStart) / (1 - descentStart)) * worldTravel
        : 0;
    if (
      progress > descentStart &&
      root.dataset.earthReady !== 'true' &&
      !pendingId &&
      notice.hidden
    )
      loading('Loading the underground…');
    const staticMode = reducedMotion();
    // Reduced motion cuts from the spring to the closed forest instead of zooming.
    const closed = progress >= forestChapter;
    document.getElementById('vista').style.transform = staticMode
      ? 'none'
      : `scale(${zoom(scales.vista, enclosure)})`;
    document.getElementById('frame').style.transform = staticMode
      ? `scale(${closed ? scales.frame[crop][1] : 4})`
      : `scale(${zoom(scales.frame[crop], enclosure)})`;
    document.getElementById('near-frame').style.transform = staticMode
      ? `scale(${closed ? scales.near[crop][1] : 8})`
      : `scale(${zoom(scales.near[crop], enclosure)}) translateX(${-enclosure * 2}%)`;
    document.getElementById('world').style.transform =
      `translateY(${-descent * 100}%)`;
    sync();
  }
  const chapterNav = document.getElementById('chapters'),
    chapters = [...chapterNav.querySelectorAll('[data-chapter]')],
    content = document.getElementById('portfolio-content');
  let chapterIndex = 0,
    chapterTimer = 0;
  function markChapter(aboutReached) {
    // Spring until the trees visibly close in (they arrive late in the zoom),
    // Forest until halfway down the descent, then Underground until the
    // introduction fills the view.
    const next = aboutReached
      ? 3
      : progress < forestChapter
        ? 0
        : progress < (1 + forestEnd) / 2
          ? 1
          : 2;
    if (next === chapterIndex) return;
    chapters[chapterIndex].removeAttribute('aria-current');
    chapters[next].setAttribute('aria-current', 'step');
    chapterIndex = next;
  }
  function scrollProgress() {
    const distance = -journey.getBoundingClientRect().top,
      split = baseTravel * forestEnd,
      aboutReached = content.getBoundingClientRect().top < innerHeight / 2;
    render(
      distance <= split
        ? distance / baseTravel
        : forestEnd +
            (pace.at(distance - split) / pace.pixels) * (1 - forestEnd)
    );
    markChapter(aboutReached);
  }
  function seek(percent, behavior = 'instant') {
    const top = journey.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + distanceAt(clamp(percent / 100)), behavior });
    // A smooth scroll reports its own progress through scroll events.
    if (behavior === 'instant') scrollProgress();
  }
  // Native smooth scrolling travels through the scene instead of cutting to it.
  chapters.forEach((button) =>
    on(button, 'click', () => {
      const behavior = reducedMotion() ? 'instant' : 'smooth';
      if (button.dataset.chapter === 'about')
        root.querySelector('.about-layout').scrollIntoView({ behavior });
      else seek(Number(button.dataset.chapter), behavior);
    })
  );
  function refreshStyle() {
    clearTimeout(styleTimer);
    const next =
      styleMode === 'auto' ? state.portfolioStyleForTime() : styleMode;
    if (next !== profileId && next !== pendingId) switchArtwork(next);
    else if (next === profileId && pendingId) {
      ++styleRequest;
      pendingId = null;
      loaded();
      if (root.dataset.springReady !== 'true') startArtwork();
      else updateFrames().catch(() => failed(startArtwork));
    }
    root.dataset.style = profileId;
    root.dataset.styleMode = styleMode;
    document.dispatchEvent(new Event('portfolio-style-change'));
    if (styleMode === 'auto' && !document.hidden) {
      const now = new Date(),
        boundary = new Date(now);
      if (now.getHours() < 6) boundary.setHours(6, 0, 0, 0);
      else if (now.getHours() < 17) boundary.setHours(17, 0, 0, 0);
      else {
        boundary.setDate(boundary.getDate() + 1);
        boundary.setHours(6, 0, 0, 0);
      }
      styleTimer = setTimeout(
        refreshStyle,
        Math.min(boundary - now + 50, 60000)
      );
    }
  }
  state.portfolioJourney = {
    seek,
    getStyle: () => profileId,
    getStyleMode: () => styleMode,
    setStyle(id) {
      if (id !== 'auto' && !Object.hasOwn(state.styleProfiles, id)) return;
      styleMode = id;
      const url = new URL(location.href);
      if (id === 'auto') url.searchParams.delete('style');
      else url.searchParams.set('style', id);
      history.replaceState(null, '', url);
      refreshStyle();
    },
  };
  on(document, 'visibilitychange', refreshStyle);
  root.querySelectorAll('button[data-method]').forEach((button) =>
    on(button, 'click', () => {
      method = button.dataset.method;
      root.dataset.method = method;
      root
        .querySelectorAll('button[data-method]')
        .forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      naturalWater.resize();
      sync();
    })
  );
  root
    .querySelectorAll('[data-stop]')
    .forEach((b) => on(b, 'click', () => seek(Number(b.dataset.stop))));
  on(play, 'click', () => {
    requested = !requested;
    sync();
  });
  on(still, 'change', () => {
    root.dataset.still = String(still.checked);
    sync();
  });
  on(reducePreview, 'change', scrollProgress);
  on(document.getElementById('narrow'), 'change', (e) => {
    scene.classList.toggle('phone', e.target.checked);
    layoutScene();
    naturalWater.resize();
  });
  on(depth, 'input', () => seek(Number(depth.value)));
  let scrollQueued = false;
  on(
    globalThis,
    'scroll',
    () => {
      restHint();
      // Name the current chapter while moving; hide it again once settled.
      if (!chapterNav.dataset.scrolling) chapterNav.dataset.scrolling = 'true';
      clearTimeout(chapterTimer);
      chapterTimer = setTimeout(() => delete chapterNav.dataset.scrolling, 900);
      if (scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(() => {
        scrollQueued = false;
        scrollProgress();
      });
    },
    { passive: true }
  );
  let paceWidth = innerWidth,
    paceHeight = innerHeight;
  on(globalThis, 'resize', () => {
    layoutScene();
    // Mobile browser bars change only the height while scrolling. Re-pacing
    // then would jump the scene under the finger, so keep the current pace.
    const barsOnly =
      coarse.matches &&
      innerWidth === paceWidth &&
      Math.abs(innerHeight - paceHeight) < 160;
    if (!barsOnly) {
      paceWidth = innerWidth;
      paceHeight = innerHeight;
      layoutPace();
    }
    naturalWater.resize();
    scrollProgress();
  });
  on(coarse, 'change', layoutScene);
  on(document, 'visibilitychange', sync);
  on(reduced, 'change', scrollProgress);
  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      sync();
    },
    { threshold: 0.1 }
  );
  observer.observe(scene);
  const surfaceObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      surfaceVisible =
        entry.isIntersecting &&
        entry.intersectionRect.width > 0 &&
        entry.intersectionRect.height > 0;
      sync();
    },
    { threshold: 0 }
  );
  surfaceObserver.observe(root.querySelector('.surface'));
  on(globalThis, 'pagehide', () => {
    requested = false;
    disposed = true;
    ++frameRequest;
    profileId = '';
    ++styleRequest;
    clearTimeout(hintTimer);
    clearTimeout(chapterTimer);
    clearTimeout(styleTimer);
    clearTimeout(earthTimer);
    observer.disconnect();
    surfaceObserver.disconnect();
    naturalWater.dispose();
  });
  layoutScene();
  layoutPace();
  naturalWater.resize();
  scrollProgress();
  // The cue normally appears once the spring is painted; this covers slow art.
  // Scrolling cancels it and uses the normal 3.2-second rest delay instead.
  hintTimer = setTimeout(introduceHint, 1000);
  refreshStyle();
  if (!pendingId) startArtwork();
}
