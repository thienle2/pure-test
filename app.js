// Deal In · join-to-table transition prototype
// Phases: lobby → press → go → load → land. Each phase is a class on .stage; styles.css does the motion.

(function () {
  'use strict';

  // Timing (ms) at normal speed. Slow-mo multiplies everything by SLOW.
  var TIMELINE = [['go', 110], ['load', 650], ['land', 2250]];
  var SLOW = 4;

  var GAMES = {
    NLH: {
      gameName: 'NLH', metaLabel: 'Stakes', metaValue: '$0.50/1.00', blinds: 'Blinds: 0.50/1.00',
      iconA: 'A', iconB: 'A', suitA: '♠', suitB: '♥',
      grad: 'linear-gradient(180deg,#0f1322 0%,#23305a 55%,#3b4a80 100%)',
      edge: 'rgba(110,140,230,.55)', accent: '#3b82f6', tableFilter: 'none'
    },
    MAHJ: {
      gameName: 'MAHJ', metaLabel: 'Buy-in', metaValue: '$100', blinds: 'Buy-in $100',
      iconA: '中', iconB: '發', suitA: '', suitB: '',
      grad: 'linear-gradient(180deg,#2a2414 0%,#5a4c26 55%,#a08f52 100%)',
      edge: 'rgba(220,195,110,.55)', accent: '#d4b85a', tableFilter: 'hue-rotate(-95deg) saturate(.7)'
    }
  };

  // The joined table starts at 4/6 and becomes 5/6 once you sit down.
  var SEATS_BEFORE = 4, SEATS_AFTER = 5;

  var LABELS = {
    lobby: 'Lobby · tap the glowing game',
    press: 'Tap',
    go: 'Cards lift off the button',
    load: 'Loading · rim draws as progress',
    land: 'Dealt in at your seat'
  };

  var stage = document.getElementById('stage');
  var fit = document.getElementById('fit');
  var hero = document.getElementById('hero');
  var heroArc = document.getElementById('heroArc');
  var tabFill = document.getElementById('tabFill');
  var timg = document.getElementById('timg');
  var phaseEl = document.getElementById('phase');
  var slowBtn = document.getElementById('slow');
  var gameBtn = document.getElementById('game');

  var state = { phase: 'lobby', slow: false, game: 'NLH' };
  var timers = [];

  // ----- Static lobby cards -----
  function buildCards() {
    var g = GAMES[state.game];
    document.querySelectorAll('.card').forEach(function (card) {
      var seats = +card.dataset.seats, of = +card.dataset.of;
      card.innerHTML =
        '<div class="hbg" style="background:' + g.grad + '"></div>' +
        '<div class="icon"><span class="mc a">' + g.iconA + '<i>' + g.suitA + '</i></span>' +
        '<span class="mc b">' + g.iconB + '<i>' + g.suitB + '</i></span></div>' +
        '<span class="nm">' + g.gameName + '</span><span class="ml">' + g.metaLabel + '</span>' +
        '<span class="mv">' + g.metaValue + '</span>' +
        '<span class="ring"><svg width="58" height="58" viewBox="0 0 58 58">' +
        '<circle cx="29" cy="29" r="25" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="3"/>' +
        '<circle cx="29" cy="29" r="25" fill="none" stroke="' + g.accent + '" stroke-width="3" stroke-linecap="round" pathLength="' + of +
        '" style="stroke-dasharray:' + seats + ' ' + of + '" transform="rotate(-90 29 29)"/></svg>' +
        '<span class="rt"><span class="rn"><b>' + seats + '</b>/' + of + '</span><small>seats</small></span></span>';
    });
  }

  // ----- Push state into the DOM -----
  function render() {
    var g = GAMES[state.game];
    var after = state.phase === 'load' || state.phase === 'land';
    var seats = after ? SEATS_AFTER : SEATS_BEFORE;

    stage.className = 'stage ' + state.phase;
    stage.style.setProperty('--t', state.slow ? SLOW : 1);

    document.querySelectorAll('[data-t]').forEach(function (el) {
      var key = el.dataset.t;
      el.textContent = key === 'seats' ? seats : g[key];
    });
    document.querySelectorAll('[data-grad]').forEach(function (el) { el.style.background = g.grad; });
    document.querySelectorAll('[data-edge]').forEach(function (el) { el.style.borderColor = g.edge; });
    document.querySelectorAll('[data-accent-stroke]').forEach(function (el) { el.setAttribute('stroke', g.accent); });
    document.querySelectorAll('[data-accent-bg]').forEach(function (el) { el.style.background = g.accent; });

    heroArc.style.strokeDasharray = seats + ' 6';
    tabFill.style.width = Math.round((seats / 6) * 100) + '%';
    timg.style.filter = g.tableFilter;
    hero.setAttribute('aria-label', 'Join ' + g.gameName + ' ' + g.metaValue + ' at The Clubhouse, ' + seats + ' of 6 seats taken');

    phaseEl.textContent = LABELS[state.phase];
    slowBtn.setAttribute('aria-pressed', state.slow ? 'true' : 'false');
    gameBtn.textContent = g.gameName === 'NLH' ? 'Game: NLH' : 'Game: MAHJ';
  }

  function set(patch) {
    for (var k in patch) state[k] = patch[k];
    render();
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  // ----- Interactions -----
  function start() {
    if (state.phase !== 'lobby') return;
    var k = state.slow ? SLOW : 1;
    clearTimers();
    set({ phase: 'press' });
    timers = TIMELINE.map(function (step) {
      return setTimeout(function () { set({ phase: step[0] }); }, step[1] * k);
    });
  }

  function replay() {
    clearTimers();
    set({ phase: 'lobby' });
  }

  hero.addEventListener('click', start);
  document.getElementById('replay').addEventListener('click', replay);
  slowBtn.addEventListener('click', function () { set({ slow: !state.slow }); });
  gameBtn.addEventListener('click', function () {
    clearTimers();
    state.game = state.game === 'NLH' ? 'MAHJ' : 'NLH';
    state.phase = 'lobby';
    buildCards();
    render();
  });

  // ----- Scale the 390×844 phone to fit the window -----
  function fitStage() {
    var ctlH = 80;
    var s = Math.min(window.innerWidth / 390, (window.innerHeight - ctlH) / 844);
    if (window.innerWidth >= 600) s = Math.min(s, 1);
    fit.style.setProperty('--s', Math.max(s, 0.3).toFixed(4));
  }
  window.addEventListener('resize', fitStage);

  // Preload the table art so it's ready when the rim finishes drawing.
  new Image().src = 'assets/table.png';

  buildCards();
  render();
  fitStage();
})();
