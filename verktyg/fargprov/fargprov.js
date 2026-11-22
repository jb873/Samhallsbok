/* Färgprov: tre nyanser av plommon kring #6e3d5e som --accent, ovanpå css/bok-samhalle.css (som har B).
 * Väljaren uppe till höger (eller tangenterna 1, 2, 3; ?farg=a|b|c i adressen) byter alla accentens värden på en
 * gång: accenten, faktarutans ton och kant, den fasta rutfärgen, bannern, papperstoningen, hover och understrykningar.
 * Kontrasten mot papperet #ece2c8 (WCAG 2.1) står i väljaren. Inte elevinnehåll. */
(function () {
  const NYANSER = {
    a: { namn: 'A · ljusare plommon', hex: '#7d4a6c', rgb: '125, 74, 108', ruta: '#ece1cf', mork: '#221220', kontrast: '5,3:1' },
    b: { namn: 'B · plommon (platshållare)', hex: '#6e3d5e', rgb: '110, 61, 94', ruta: '#ebe0ce', mork: '#1d0f19', kontrast: '6,5:1' },
    c: { namn: 'C · djup aubergine', hex: '#5b2f4e', rgb: '91, 47, 78', ruta: '#e9dfcc', mork: '#170b14', kontrast: '8,3:1' }
  };
  const stil = document.createElement('style');
  const css = n => `
    :root { --accent: ${n.hex}; --ruta-ton: rgba(${n.rgb}, .07); --ruta-kant: rgba(${n.rgb}, .35); --ruta: ${n.ruta}; }
    body { background-image: radial-gradient(ellipse at top left, rgba(${n.rgb}, .06) 0%, rgba(${n.rgb}, 0) 55%),
      radial-gradient(ellipse at bottom right, rgba(184, 144, 42, .07) 0%, rgba(184, 144, 42, 0) 55%); }
    .hero-banner { background: linear-gradient(180deg, ${n.mork} 0%, var(--accent) 100%); }
    .niva-valjare .niva-knapp:hover { background-color: rgba(${n.rgb}, .1); }
    a.begrepp, .bok-lank, .bok-lank-sida { text-decoration-color: rgba(${n.rgb}, .45); }`;
  const knappar = {};
  let vald = 'b';
  const valj = id => {
    vald = NYANSER[id] ? id : 'b';
    stil.textContent = css(NYANSER[vald]);
    Object.entries(knappar).forEach(([k, b]) => b.setAttribute('aria-pressed', String(k === vald)));
  };
  const panel = () => {
    const p = document.createElement('div');
    p.className = 'fargprov-panel';
    p.setAttribute('role', 'group');
    p.setAttribute('aria-label', 'Färgprov');
    const rubrik = document.createElement('div');
    rubrik.className = 'fargprov-rubrik';
    rubrik.textContent = 'Färgprov – accent (1, 2, 3)';
    p.appendChild(rubrik);
    Object.entries(NYANSER).forEach(([id, n]) => {
      const b = document.createElement('button');
      b.type = 'button';
      const ruta = document.createElement('span');
      ruta.className = 'fargprov-ruta';
      ruta.style.background = n.hex;
      const text = document.createElement('span');
      text.innerHTML = `${n.namn}<br><small>${n.hex} · ${n.kontrast} mot papperet</small>`;
      b.append(ruta, text);
      b.onclick = () => valj(id);
      knappar[id] = b;
      p.appendChild(b);
    });
    return p;
  };
  const panelStil = document.createElement('style');
  panelStil.textContent = `
    .fargprov-panel { position: fixed; top: 10px; right: 10px; z-index: 2147483000; max-width: 260px;
      background: #f4ecd6; color: #1b2a36; border: 1px solid rgba(27, 42, 54, .25); border-radius: 8px;
      padding: 8px 10px; font: 14px/1.35 'EB Garamond', Georgia, serif; box-shadow: 0 2px 10px rgba(0, 0, 0, .18); }
    .fargprov-rubrik { font-weight: 600; margin-bottom: 4px; }
    .fargprov-panel button { display: flex; align-items: center; gap: 8px; width: 100%; margin: 3px 0; padding: 4px 6px;
      cursor: pointer; background: transparent; border: 1px solid transparent; border-radius: 6px; font: inherit;
      color: inherit; text-align: left; }
    .fargprov-panel button[aria-pressed="true"] { border-color: #1b2a36; background: #ece2c8; }
    .fargprov-ruta { width: 22px; height: 22px; border-radius: 4px; flex: none; }`;
  document.head.append(stil, panelStil);
  valj((new URLSearchParams(location.search).get('farg') || 'b').toLowerCase());
  window.addEventListener('DOMContentLoaded', () => { document.body.appendChild(panel()); valj(vald); });
  window.addEventListener('keydown', e => {
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    const id = { 1: 'a', 2: 'b', 3: 'c' }[e.key];
    if (id) valj(id);
  }, true);
})();
