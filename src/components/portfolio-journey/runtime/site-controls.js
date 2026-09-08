// Approved portfolio renderer; lifecycle is owned by the React route.
export default function initialize(state, on) {
  const shell = document.createElement('div');
  shell.className = 'site-tools';
  shell.innerHTML = `
    <button class="menu-trigger" id="menu-trigger" aria-expanded="false" aria-controls="site-menu"><span class="hamburger" aria-hidden="true"><i></i><i></i><i></i></span><span>Menu</span></button>
    <nav class="forest-panel site-menu" id="site-menu" aria-label="Main navigation" hidden>
      <p class="panel-eyebrow">Alek Racz</p>
      <a href="#journey" data-jump="0">Home</a>
      <label class="developer-switch"><span>Developer Studio Mode</span><input id="developer-toggle" type="checkbox" role="switch"><span class="switch-track" aria-hidden="true"></span></label>
    </nav>
    <button id="dev-launcher" class="dev-launcher" aria-expanded="false" aria-controls="developer-panel" hidden>Dev. Studio</button>
    <aside id="developer-panel" class="forest-panel developer-panel" aria-label="Developer studio" data-tab="journey" hidden>
      <div class="panel-heading"><span class="panel-eyebrow">Developer studio</span><button id="dev-close" aria-label="Minimize developer studio">−</button></div>
      <div class="studio-tabs" role="tablist" aria-label="Developer tools">
        <button id="tab-journey" role="tab" aria-selected="true" aria-controls="pane-journey" data-tab="journey">Journey</button>
        <button id="tab-hand" role="tab" aria-selected="false" aria-controls="pane-hand" data-tab="hand" tabindex="-1">Animation</button>
        <button id="tab-art" role="tab" aria-selected="false" aria-controls="pane-art" data-tab="art" tabindex="-1">Art styles</button>
      </div>
      <section id="pane-journey" role="tabpanel" aria-labelledby="tab-journey"><h2>Explore the scene</h2><div id="studio-journey-controls"></div></section>
      <section id="pane-hand" role="tabpanel" aria-labelledby="tab-hand" hidden><div class="studio-hand-preview"><div class="scroll-hint shown"><span class="gesture-touch"></span></div></div><div id="studio-hand-controls"></div><div class="studio-actions"><button id="hand-replay">Replay</button><button id="hand-reset">Reset</button></div><p class="studio-note">Live preview only. Reload to restore the selected settings.</p></section>
      <section id="pane-art" role="tabpanel" aria-labelledby="tab-art" hidden><h2>Choose the atmosphere</h2><div id="studio-art-options"></div><p class="studio-note" id="art-status" role="status">Cel shading selected.</p></section>
      <p class="studio-message" id="studio-message" role="status"></p>
    </aside>`;
  document.getElementById('study').append(shell);
  const menu = shell.querySelector('#site-menu'),
    trigger = shell.querySelector('#menu-trigger');
  const panel = shell.querySelector('#developer-panel'),
    toggle = shell.querySelector('#developer-toggle'),
    launcher = shell.querySelector('#dev-launcher');
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  let panelMotion = null,
    contentMotion = null;
  function cancelResize() {
    panelMotion?.cancel();
    contentMotion?.cancel();
    panelMotion = null;
    contentMotion = null;
    panel.style.removeProperty('overflow');
  }
  function menuOpen(open) {
    menu.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
  }
  function studioOpen(open) {
    cancelResize();
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    launcher.hidden = !toggle.checked || open;
  }
  on(trigger, 'click', () => menuOpen(menu.hidden));
  on(document, 'pointerdown', (e) => {
    if (!menu.hidden && !menu.contains(e.target) && !trigger.contains(e.target))
      menuOpen(false);
  });
  on(document, 'keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!menu.hidden) {
      menuOpen(false);
      trigger.focus();
    } else if (!panel.hidden) {
      studioOpen(false);
      launcher.focus();
    }
  });
  menu.querySelectorAll('a').forEach((a) =>
    on(a, 'click', (e) => {
      if (a.dataset.jump) {
        e.preventDefault();
        state.portfolioJourney.seek(+a.dataset.jump);
      }
      menuOpen(false);
    })
  );
  on(toggle, 'change', () => {
    studioOpen(toggle.checked);
    menuOpen(false);
    if (toggle.checked)
      shell.querySelector('[role=tab][aria-selected=true]').focus();
  });
  on(launcher, 'click', () => {
    studioOpen(true);
    shell.querySelector('[role=tab][aria-selected=true]').focus();
  });
  on(shell.querySelector('#dev-close'), 'click', () => {
    studioOpen(false);
    launcher.focus();
  });
  const tabs = [...shell.querySelectorAll('[role=tab]')];
  function selectTab(tab) {
    if (panel.dataset.tab === tab.dataset.tab) return;
    const before = panel.getBoundingClientRect();
    cancelResize();
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      shell.querySelector('#pane-' + t.dataset.tab).hidden = !selected;
    });
    panel.dataset.tab = tab.dataset.tab;
    panel.scrollTop = 0;
    if (tab.dataset.tab === 'hand') {
      const host = shell.querySelector('.gesture-touch');
      if (!host.querySelector('video')) state.mountPortfolioGesture(host);
    }
    if (
      panel.hidden ||
      motionPreference.matches ||
      document.getElementById('study').dataset.reduced === 'true'
    )
      return;
    panel.style.overflow = 'hidden';
    const after = panel.getBoundingClientRect();
    const animation = panel.animate(
      [
        { width: before.width + 'px', height: before.height + 'px' },
        { width: after.width + 'px', height: after.height + 'px' },
      ],
      { duration: 650, easing: 'cubic-bezier(.22,.65,.25,1)' }
    );
    panelMotion = animation;
    contentMotion = shell
      .querySelector('#pane-' + tab.dataset.tab)
      .animate([{ opacity: 0.3 }, { opacity: 1 }], {
        duration: 400,
        delay: 150,
        fill: 'backwards',
        easing: 'ease-out',
      });
    animation.finished
      .then(() => {
        if (panelMotion === animation) {
          panelMotion = null;
          panel.style.removeProperty('overflow');
        }
      })
      .catch(() => {});
  }
  on(globalThis, 'resize', cancelResize);
  on(motionPreference, 'change', cancelResize);
  on(globalThis, 'pagehide', cancelResize);
  tabs.forEach((tab, i) => {
    on(tab, 'click', () => selectTab(tab));
    on(tab, 'keydown', (e) => {
      let next;
      if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft')
        next = (i + tabs.length - 1) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      else return;
      e.preventDefault();
      selectTab(tabs[next]);
      tabs[next].focus();
    });
  });
  const original = document.querySelector('.study-settings'),
    journeyControls = shell.querySelector('#studio-journey-controls');
  original
    .querySelectorAll('.transport,.controls,#status')
    .forEach((el) => journeyControls.append(el));
  original.hidden = true;
  const defaults = { ...state.portfolioGestureSettings },
    settings = state.portfolioGestureSettings;
  const definitions = [
    ['fadeIn', 'Fade in', 0, 2, 0.05, 's'],
    ['fadeOut', 'Fade out', 0, 2, 0.05, 's'],
    ['speed', 'Speed', 0.5, 3, 0.05, '×'],
    ['hold', 'Final hold', 0, 5, 0.05, 's'],
    ['rest', 'Hidden rest', 0, 5, 0.05, 's'],
    ['opacity', 'Opacity', 0, 1, 0.01, '%'],
  ];
  const inputs = {};
  definitions.forEach(([key, label, min, max, step, unit]) => {
    const row = document.createElement('label');
    row.className = 'studio-range';
    row.htmlFor = 'studio-' + key;
    row.innerHTML = `<span>${label}</span><output></output><input id="studio-${key}" type="range" min="${min}" max="${max}" step="${step}" value="${settings[key]}">`;
    inputs[key] = row.querySelector('input');
    const output = row.querySelector('output');
    const display = () =>
      (output.value =
        unit === '%'
          ? Math.round(settings[key] * 100) + '%'
          : settings[key].toFixed(2) + unit);
    on(inputs[key], 'input', () => {
      settings[key] = +inputs[key].value;
      display();
      document.dispatchEvent(new Event('gesture-settings-change'));
    });
    display();
    row.update = display;
    shell.querySelector('#studio-hand-controls').append(row);
  });
  const message = shell.querySelector('#studio-message');
  on(shell.querySelector('#hand-replay'), 'click', () =>
    document.dispatchEvent(new Event('gesture-settings-change'))
  );
  on(shell.querySelector('#hand-reset'), 'click', () => {
    Object.assign(settings, defaults);
    for (const key in inputs) {
      inputs[key].value = settings[key];
      inputs[key].parentElement.update();
    }
    document.dispatchEvent(new Event('gesture-settings-change'));
    message.textContent = 'Selected animation settings restored.';
  });
  const current = state.portfolioJourney.getStyle();
  const autoButton = document.createElement('button');
  autoButton.className = 'art-choice';
  autoButton.dataset.style = 'auto';
  autoButton.textContent = 'Automatic · browser local time';
  on(autoButton, 'click', () => state.portfolioJourney.setStyle('auto'));
  shell.querySelector('#studio-art-options').append(autoButton);
  Object.entries(state.styleProfiles).forEach(([id, profile]) => {
    const button = document.createElement('button');
    button.className = 'art-choice';
    button.setAttribute('aria-pressed', String(id === current));
    button.dataset.style = id;
    const image = document.createElement('img');
    image.src = profile.thumb;
    image.alt = '';
    image.loading = 'lazy';
    const label = document.createElement('span');
    label.textContent = profile.label;
    button.append(image, label);
    on(button, 'click', () => state.portfolioJourney.setStyle(id));
    shell.querySelector('#studio-art-options').append(button);
  });
  function updateStyleStatus() {
    const id = state.portfolioJourney.getStyle(),
      mode = state.portfolioJourney.getStyleMode();
    shell
      .querySelectorAll('.art-choice')
      .forEach((button) =>
        button.setAttribute(
          'aria-pressed',
          String(button.dataset.style === mode)
        )
      );
    shell.querySelector('#art-status').textContent =
      mode === 'auto'
        ? 'Automatic: ' +
          state.styleProfiles[id].label +
          '. Evening 5 PM–6 AM; day otherwise.'
        : state.styleProfiles[id].label + ' · manual preview.';
  }
  on(document, 'portfolio-style-change', updateStyleStatus);
  on(document.getElementById('spring'), 'load', updateStyleStatus);
  updateStyleStatus();
}
