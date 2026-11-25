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
 * Uppslaget (väg 3, Joachims layout 2026-11-25, till: 'uppslag'): uppgiftstexten på en vänstersida och skrivmodellen
 * direkt efter, på högersidan bredvid – aldrig en tom sida emellan – och svarsrutan på nästa uppslag. */
function oppenUppgift(id, nr, uppgiftText, kriterium, delar) {
  const prompt = MALL.replace('[uppgiftens text]', () => uppgiftText).replace('[A-kriteriet]', () => kriterium).replace('[skrivmodellen]', () => tillPrompt(delar));
  kolla(!/\[(uppgiftens text|A-kriteriet|skrivmodellen|A-exemplet)\]/.test(prompt) && prompt.split(PLATSHALLARE).length === 2, `uppgift ${nr}: prompten blev inte ifylld`);
  return { typ: 'uppgift', id, slag: 'oppen', skrivmodell: tillBok(delar), prompt, platshallare: PLATSHALLARE, hjalp: HJALP,
    till: 'uppslag' };
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

/* Uppgiftens källtexter och tabeller (Media, Joachims beslut 2026-11-25; motorn: slag 'citat' och 'tabell'). Ett stycke i
 * uppgiften är
 *   ett citat:  rader som börjar med ">" – varje rad ett stycke, rader i följd som börjar med "- " en lista, och en sista
 *               rad "Källa: …" källraden. En fetstilt rad direkt före ("**Text 1**") är citatets rubrik.
 *   en tabell:  en markdowntabell utan kryssrutor (☐). Ett stycke direkt före som börjar med en fetstilt rad ("**Tabell 1**",
 *               "**Källa 2**") är tabellens rubrik och text, och ett stycke direkt efter som är en rad "Källa: …" dess källrad.
 * En tabell med kryssrutor är ett kolumn-kryss (verktygen). lasStimulus(stycken, i, …) läser stimulus som börjar i stycke i
 * och svarar med blocket, texten till prompten och antalet stycken det tog – eller null. "> **Försök att:**" är ingen
 * källtext (Öva-bokens ruta). */
const raderAv = s => s.split('\n').map(x => x.trim());
const fetRad = x => /^\*\*[^*]+\*\*$/.test(x);
const arTabell = s => raderAv(s).every(x => /^\|/.test(x));
const arKryssTabell = s => arTabell(s) && /☐/.test(s);
const arStimTabell = s => arTabell(s) && !/☐/.test(s);
const citatRader = s => { const r = raderAv(s); return fetRad(r[0]) && r.length > 1 ? r.slice(1) : r; };
const arCitat = s => citatRader(s).every(x => /^>/.test(x)) && !/^>\s*\*\*Försök att:\*\*/.test(citatRader(s)[0]);
const listText = x => Array.isArray(x) ? x.map(p => `- ${ren(p)}`).join('\n') : ren(x);
function lasStimulus(stycken, i, id, raknare) {
  const s = stycken[i], nytt = (slag, k = ++raknare[slag]) => `${id}-${slag}${k > 1 ? k : ''}`;
  if (arCitat(s)) {
    const r = raderAv(s), rubrik = fetRad(r[0]) && r.length > 1 ? r[0].slice(2, -2) : null, st = [];
    for (const x of citatRader(s).map(y => y.replace(/^>\s?/, '').trim()).filter(Boolean)) {
      if (/^- /.test(x)) { if (Array.isArray(st[st.length - 1])) st[st.length - 1].push(x.slice(2)); else st.push([x.slice(2)]); }
      else st.push(x);
    }
    const kalla = st.length > 1 && typeof st[st.length - 1] === 'string' && /^Källa: /.test(st[st.length - 1]) ? st.pop() : null;
    kolla(st.length, `${id}: ett citat utan text`);
    return { steg: 1, block: Object.assign({ typ: 'uppgift', id: nytt('citat'), slag: 'citat' }, rubrik ? { rubrik: stil(rubrik) } : {},
      { rader: st.map(x => Array.isArray(x) ? x.map(stil) : stil(x)) }, kalla ? { kalla: stil(kalla) } : {}),
      prompt: [].concat(rubrik ? [ren(rubrik)] : [], st.map(listText), kalla ? [ren(kalla)] : []).join('\n') };
  }
  const fore = !arTabell(s) && fetRad(raderAv(s)[0]) && stycken[i + 1] && arStimTabell(stycken[i + 1]);
  if (!fore && !arStimTabell(s)) return null;
  const t = fore ? i + 1 : i, rader = tabellrader(stycken[t]).map(celler);
  const efter = stycken[t + 1] && raderAv(stycken[t + 1]).length === 1 && /^Källa: /.test(stycken[t + 1].trim()) ? stycken[t + 1].trim() : null;
  const huvud = fore ? raderAv(s) : [], rubrik = huvud.length ? huvud[0].slice(2, -2) : null, text = huvud.slice(1);
  kolla(rader.length > 1 && rader.every(x => x.length === rader[0].length), `${id}: tabellens rader har olika många celler`);
  return { steg: t - i + 1 + (efter ? 1 : 0),
    block: Object.assign({ typ: 'uppgift', id: nytt('tabell'), slag: 'tabell' }, rubrik ? { rubrik: stil(rubrik) } : {},
      text.length ? { text: text.map(stil) } : {}, { rubriker: rader[0].map(stil), rader: rader.slice(1).map(x => x.map(stil)) },
      efter ? { kalla: stil(efter) } : {}),
    prompt: [].concat(rubrik ? [ren(rubrik)] : [], text.map(ren), rader.map(x => x.map(ren).join(' | ')), efter ? [ren(efter)] : []).join('\n') };
}

/* Flervalet (NP 2018 A3, Joachims beslut 2026-11-25): ett stycke "a) Begrepp" med alternativen som punkter under. Facit:
 * "- a) <alternativet>" eller "- a) Begrepp: <alternativet>" – svaret är det alternativ som facitraden är eller slutar med
 * (precis ett). Facitraderna står efter "**Facit" eller "**Rätta svar". */
const arFlerval = s => { const r = raderAv(s); return /^[a-z]\) /.test(r[0]) && r.length > 2 && r.slice(1).every(x => /^- /.test(x)); };
function flervalRad(s) {
  const r = raderAv(s), m = r[0].match(/^([a-z])\) (.+)$/);
  return { etikett: `${m[1]})`, text: stil(m[2]), alternativ: r.slice(1).map(x => stil(x.replace(/^- /, ''))), nyckel: m[1], kallrader: r.slice(1).map(x => x.replace(/^- /, '')) };
}
function flervalRader(nr, fler, bedom) {
  const fi = bedom.search(/\*\*(Facit|Rätta svar)/);
  kolla(fi >= 0, `uppgift ${nr}: inget facit`);
  const facitrader = fi >= 0 ? bedom.slice(fi).split('\n').filter(x => /^- [a-z]\) /.test(x)) : [];
  kolla(facitrader.length === fler.length, `uppgift ${nr}: ${fler.length} rader men ${facitrader.length} facitrader`);
  return fler.map(r => {
    const f = facitrader.find(x => x.startsWith(`- ${r.nyckel}) `)), rest = f ? f.slice(r.nyckel.length + 4) : null;
    const tr = f ? r.kallrader.map((a, i) => rest === a || f.endsWith(': ' + a) ? i : -1).filter(i => i >= 0) : [];
    kolla(tr.length === 1, `uppgift ${nr}: rad ${r.etikett} – facit träffar ${tr.length} alternativ`);
    return { etikett: r.etikett, text: r.text, alternativ: r.alternativ, svar: tr.length === 1 ? tr[0] : -1 };
  });
}

// Inget som citeras i en bedömningsanvisning (A-exemplen och andra exempelsvar, t.ex. 2016 B9:s "Exempel på förklaring
// med förtydligande") får stå i boken: ingen citerad rad (de första 40 tecknen)
function citatSparr(bedomningar, ut) {
  bedomningar.forEach(b => b.split('\n').filter(r => /^>/.test(r)).map(r => r.replace(/^>\s?/, '').trim()).filter(r => r.length > 30)
    .forEach(r => kolla(!ut.includes(r.slice(0, 40)), `ett citat ur bedömningen står i boken: ”${r.slice(0, 40)}…”`)));
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

// Skrivmodellen (Del C ur Joachims samlade material, ordagrant): samma för alla teman och båda böckerna
const SKRIVMODELL = fs.readFileSync(path.join(ROT, 'kallor', 'ovningar', 'skrivmodell.md'), 'utf8').replace(/\r\n/g, '\n');

module.exports = { ROT, PLATSHALLARE, HJALP, MALL, SKRIVMODELL, fel, kolla, stoppaVidFel, stil, ren, celler, tabellrader, delAv,
  lasModell, modellFor, tillBok, tillPrompt, oppenUppgift, facitMedNycklar, aExempelSparr, skrivBok,
  arTabell, arKryssTabell, arStimTabell, arCitat, lasStimulus, arFlerval, flervalRad, flervalRader, citatSparr };
