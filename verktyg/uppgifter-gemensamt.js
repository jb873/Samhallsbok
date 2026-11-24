/* uppgifter-gemensamt.js – det som verktyg/md-till-uppgifter.js (Öva-boken, Del B) och verktyg/md-till-np.js
 * (Nationella prov-boken, Del A) delar, så att de två övningsböckerna byggs på samma sätt: texten ordagrant i motorns
 * märkning, skrivmodellen ur Del C, prompten ur kallor/ovningar/ai-mall.txt och spärren mot A-exemplen.
 * Inget här är ämnesspecifikt utom mallens plats och raden under kopiera-knappen. */
'use strict';
const fs = require('fs'), path = require('path');
const ROT = path.join(__dirname, '..');

const PLATSHALLARE = '[klistras in av eleven]';
const HJALP = 'Klistra in i skolans Google-AI i Classroom. Det du har skrivit i rutan följer med.';
const MALL = fs.readFileSync(path.join(ROT, 'kallor', 'ovningar', 'ai-mall.txt'), 'utf8').replace(/\r\n/g, '\n').trim();

// Felen samlas och skrivs ut på en gång; verktyget stoppar om något inte stämmer
const fel = [];
const kolla = (villkor, text) => { if (!villkor) fel.push(text); };
const stoppaVidFel = () => { if (fel.length) { console.error(fel.join('\n')); process.exit(1); } };

// Motorns märkning: **fet** blir *fet* (motorns enda markering), *kursiv* blir vanlig text. ren: utan märkning (prompten).
const stil = s => s.replace(/\*\*(.+?)\*\*/g, '\u0000$1\u0001').replace(/\*(.+?)\*/g, '$1').replace(/[\u0000\u0001]/g, '*').trim();
const ren = s => s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').trim();
const celler = rad => rad.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
const tabellrader = text => text.split('\n').filter(r => /^\|/.test(r) && !/^\|[-\s|]+\|$/.test(r));

// En del av det samlade materialet, från en rubrik till nästa
const delAv = (md, fran, till) => { const a = md.indexOf(fran), b = md.indexOf(till, a + 1); kolla(a >= 0 && b > a, `hittar inte ${fran}`); return md.slice(a, b); };

/* Del C: skrivmodellen. Avsnitten "**Rubrik** (vad)" med punkter och underpunkter. Eleven ser Redogöra och Resonera,
 * inte bedömnings- och nivådelarna (Joachims beslut 6, 2026-11-23). */
function lasModell(delC) {
  const modell = [];
  for (const rad of delC.split('\n')) {
    const rubrik = rad.match(/^\*\*(.+?)\*\*\s*(\(.*\))?\s*$/);
    if (rubrik) { modell.push({ rubrik: rubrik[1], vad: rubrik[2] ? rubrik[2].slice(1, -1) : null, punkter: [] }); continue; }
    const p = rad.match(/^(\s*)- (.+)$/);
    if (p && modell.length) {
      const lista = modell[modell.length - 1].punkter;
      if (p[1].length) lista[lista.length - 1].under.push(p[2]); else lista.push({ text: p[2], under: [] });
    }
  }
  kolla(modell.length === 4 && /^Redogöra/.test(modell[0].rubrik) && /^Resonera/.test(modell[1].rubrik), 'Del C: väntade fyra avsnitt (Redogöra, Resonera, Koppling, Nivåerna)');
  return modell;
}
// Redogöra för en beskriv-uppgift, Redogöra och Resonera för en resonera-uppgift
const modellFor = (modell, elevdel) => /^Resonera /m.test(elevdel) ? modell.slice(0, 2) : modell.slice(0, 1);
const tillBok = delar => delar.map(d => ({ rubrik: d.rubrik, vad: d.vad,
  punkter: d.punkter.map(p => Object.assign({ text: stil(p.text) }, p.under.length ? { under: p.under.map(stil) } : {})) }));
const tillPrompt = delar => delar.map(d => [d.rubrik + (d.vad ? ` (${d.vad})` : ''),
  ...d.punkter.flatMap(p => [`- ${ren(p.text)}`, ...p.under.map(x => `  - ${ren(x)}`)])].join('\n')).join('\n\n');

/* En öppen uppgift: prompten är mallen ifylld med uppgiftens text, A-kriteriet och skrivmodellen (aldrig A-exemplet).
 * Uppslaget (väg 3): skrivmodellen på en vänstersida och svarsrutan överst på högersidan bredvid. */
function oppenUppgift(id, nr, uppgiftText, kriterium, delar) {
  const prompt = MALL.replace('[uppgiftens text]', () => uppgiftText).replace('[A-kriteriet]', () => kriterium).replace('[skrivmodellen]', () => tillPrompt(delar));
  kolla(!/\[(uppgiftens text|A-kriteriet|skrivmodellen|A-exemplet)\]/.test(prompt) && prompt.split(PLATSHALLARE).length === 2, `uppgift ${nr}: prompten blev inte ifylld`);
  return { typ: 'uppgift', id, slag: 'oppen', skrivmodell: tillBok(delar), prompt, platshallare: PLATSHALLARE, hjalp: HJALP,
    till: { skrivmodell: 'vanster', svar: 'hoger' } };
}

// Facit för Ja/Nej står som ord i bedömningen, inte radnummer: varje nyckelord ska träffa precis en rad
function facitMedNycklar(nr, rader, nycklar) {
  kolla(nycklar, `uppgift ${nr}: inga nyckelord för facit`);
  if (nycklar) [['Ja', 0], ['Nej', 1]].forEach(([kol, v]) => nycklar[kol].forEach(ord => {
    const tr = rader.map((r, k) => r.text.includes(ord) ? k : -1).filter(k => k >= 0);
    kolla(tr.length === 1, `uppgift ${nr}: nyckelordet ”${ord}” träffar ${tr.length} rader`);
    if (tr.length === 1) rader[tr[0]].svar = v;
  }));
}

// A-exemplen får aldrig följa med: ingen rad ur ett A-exempel i källan (de första 40 tecknen) får stå i boken
function aExempelSparr(exempel, ut, vantat) {
  exempel.forEach((ex, k) => ex.split('\n').map(r => r.replace(/^>\s?/, '').trim()).filter(r => r.length > 30)
    .forEach(r => kolla(!ut.includes(r.slice(0, 40)), `A-exempel ${k + 1} står i boken: ”${r.slice(0, 40)}…”`)));
  kolla(exempel.length === vantat, `väntade ${vantat} A-exempel i källan (för kontrollen), fick ${exempel.length}`);
}

function skrivBok(ut, huvud, avsnitt) {
  const json = JSON.stringify({ avsnitt }, null, 1);
  return { json, skriv: () => fs.writeFileSync(ut, `${huvud}\nBok.niva('repetitionsbok', ${json});\n`) };
}

module.exports = { ROT, PLATSHALLARE, HJALP, MALL, fel, kolla, stoppaVidFel, stil, ren, celler, tabellrader, delAv,
  lasModell, modellFor, tillBok, tillPrompt, oppenUppgift, facitMedNycklar, aExempelSparr, skrivBok };
