#!/usr/bin/env node
/* md-till-uppgifter.js – för in övningarna till ett tema (arbetsorder 2026-11-23) i temats övningsbok,
 * infor-slutprovet/<tema>/innehall/ovningar.js, som motorns övningar ({typ: 'uppgift'}, bokskal/README.md).
 *
 *   node verktyg/md-till-uppgifter.js "<Hämtade filer>/Samlat_material_Individ_migration_minoriteter.md" [tema]
 *
 * Ur Joachims samlade material läses bara Del B (de NP-liknande uppgifterna, elevdelen och bedömningsanvisningen) och
 * Del C (skrivmodellen). Del A (original-NP) och Del D läses inte. A-exemplen läses aldrig: de stannar i källmaterialet
 * (Joachims beslut 2026-11-23) och finns varken i prompten eller i källkoden. Källfilen läggs inte i repot.
 *
 * Texten förs över ordagrant: **fet** blir *fet* (motorns enda markering), *kursiv* blir vanlig text.
 *   Ja/Nej och Stämmer/Stämmer inte → slag 'tvaval' (facit: Ja = 0, Nej = 1; Stämmer = 0, Stämmer inte = 1)
 *   lucktext                         → slag 'lucktext' (godkända svar: facit och dess bestämda form, BESTAMD nedan)
 *   öppen                            → slag 'oppen': skrivmodellen (Del C) och prompten (kallor/ovningar/ai-mall.txt,
 *                                      ifylld med uppgiftens text, A-kriteriet och skrivmodellen)
 * Varje uppgift blir ett numrerat avsnitt (ny sida per uppgift). Stoppar med fel om något inte stämmer. */
'use strict';
const fs = require('fs'), path = require('path');
const ROT = path.join(__dirname, '..');
const [KALLA, TEMA = 'individ-migration-minoriteter'] = process.argv.slice(2);
const PREFIX = { 'individ-migration-minoriteter': 'sam-imm' };   // övningarnas id (elevens svar sparas på dem – byt aldrig)
const UT = path.join(ROT, 'infor-slutprovet', TEMA, 'innehall', 'ovningar.js');
const MALL = fs.readFileSync(path.join(ROT, 'kallor', 'ovningar', 'ai-mall.txt'), 'utf8').replace(/\r\n/g, '\n').trim();
const PLATSHALLARE = '[klistras in av eleven]';
const HJALP = 'Klistra in i skolans Google-AI i Classroom. Det du har skrivit i rutan följer med.';
if (!KALLA || !PREFIX[TEMA]) { console.error('Ange källfilen (Samlat_material_….md) och ett tema med prefix i PREFIX.'); process.exit(1); }

const fel = [];
const kolla = (villkor, text) => { if (!villkor) fel.push(text); };
const md = fs.readFileSync(KALLA, 'utf8').replace(/\r\n/g, '\n');
const del = (fran, till) => { const a = md.indexOf(fran), b = md.indexOf(till, a + 1); kolla(a >= 0 && b > a, `hittar inte ${fran}`); return md.slice(a, b); };
const delB = del('\n# Del B', '\n# Del C'), delC = del('\n# Del C', '\n# Del D');

const stil = s => s.replace(/\*\*(.+?)\*\*/g, '\u0000$1\u0001').replace(/\*(.+?)\*/g, '$1').replace(/[\u0000\u0001]/g, '*').trim();
const ren = s => s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').trim();   // utan märkning (prompten)
const celler = rad => rad.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
const tabellrader = text => text.split('\n').filter(r => /^\|/.test(r) && !/^\|[-\s|]+\|$/.test(r));

/* ---------- Del C: skrivmodellen. Eleven ser Redogöra och Resonera, inte bedömnings- och nivådelarna (beslut 6). ---------- */
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
const tillBok = delar => delar.map(d => ({ rubrik: d.rubrik, vad: d.vad,
  punkter: d.punkter.map(p => Object.assign({ text: stil(p.text) }, p.under.length ? { under: p.under.map(stil) } : {})) }));
const tillPrompt = delar => delar.map(d => [d.rubrik + (d.vad ? ` (${d.vad})` : ''),
  ...d.punkter.flatMap(p => [`- ${ren(p.text)}`, ...p.under.map(x => `  - ${ren(x)}`)])].join('\n')).join('\n\n');

/* ---------- Del B: uppgifterna ---------- */
const bitar = delB.split(/\n## Uppgift (\d+) – (.+)\n/).slice(1);
const uppgifter = [];
for (let i = 0; i < bitar.length; i += 3) uppgifter.push({ nr: +bitar[i], titel: bitar[i + 1].trim(), kropp: bitar[i + 2] });
kolla(uppgifter.length === 6, `Del B: väntade sex uppgifter, fick ${uppgifter.length}`);

// Facit för Ja/Nej står som ord, inte radnummer: varje nyckelord ska träffa precis en rad, och antalet ska vara facitets
const JA_NEJ_NYCKLAR = {
  'individ-migration-minoriteter': { 1: { Ja: ['modersmålsundervisning', 'sänder program', 'använda samiska', 'förskola', 'äldreomsorg'],
    Nej: ['betala skatt', 'egna lagar', 'förtur', 'inte behöver följa'] } }
}[TEMA] || {};
// Godkända svar i lucktexten utöver facit: bestämd form (Joachims beslut 4: var generös; stora och små bokstäver spelar
// ingen roll – det sköter motorn). BÖJNINGSLISTAN ÄR LÅST: Joachim bekräftade den 2026-11-24. Ändra den bara på hans beslut.
const BESTAMD = {
  'födelseöverskott': ['födelseöverskottet'], 'urbanisering': ['urbaniseringen'], 'assimilation': ['assimilationen'],
  'flykting': ['flyktingen'], 'fri rörlighet': ['fri rörligheten', 'fria rörligheten'], 'socialt arv': ['sociala arvet'],
  'urfolk': ['urfolket'], 'permanent uppehållstillstånd': ['permanenta uppehållstillståndet']
};

const avsnitt = [];
for (const u of uppgifter) {
  const [elev, bedom] = u.kropp.split('\n### Bedömningsanvisning\n');
  kolla(bedom, `uppgift ${u.nr}: ingen bedömningsanvisning`);
  if (!bedom) continue;
  const id = `${PREFIX[TEMA]}-u${u.nr}`, block = [];
  const tabell = tabellrader(elev);
  const stycken = elev.replace(/^\|.*$/gm, '').split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
  const slag = tabell.length && /^\| Ja \| Nej \|/.test(tabell[0]) ? 'janej' : tabell.length && /Stämmer \| Stämmer inte/.test(tabell[0]) ? 'stammer'
    : /\nBegrepp: /.test(elev) ? 'lucktext' : 'oppen';
  let ordbank = null;

  // Elevdelens stycken, i ordning. Tabellen, begreppen och lucktextens meningar står i övningsblocket.
  for (const s of stycken) {
    if (/^>/.test(s)) {                                   // > **Försök att:** och punkterna
      const r = s.split('\n').map(x => x.replace(/^>\s?/, ''));
      kolla(/^\*\*Försök att:\*\*$/.test(r[0]), `uppgift ${u.nr}: oväntad ruta ”${r[0]}”`);
      block.push({ typ: 'ruta', rubrik: 'Försök att:', punkter: r.slice(1).map(x => stil(x.replace(/^- /, ''))).filter(Boolean) });
    } else if (/^Begrepp: /.test(s)) ordbank = s.replace(/^Begrepp: /, '').split(',').map(x => x.trim());
    else if (!/^\d+\. .*______/.test(s)) block.push({ typ: 'text', text: s.split('\n').map(stil).join(' ') });
  }

  if (slag === 'janej' || slag === 'stammer') {
    const kolumner = slag === 'janej' ? ['Ja', 'Nej'] : ['Stämmer', 'Stämmer inte'];
    const rader = tabell.slice(1).map(r => { const c = celler(r); return slag === 'janej' ? { text: stil(c[2]) } : { etikett: c[0], text: stil(c[1]) }; });
    if (slag === 'janej') {
      const n = JA_NEJ_NYCKLAR[u.nr];
      kolla(n, `uppgift ${u.nr}: inga nyckelord för facit`);
      if (n) [['Ja', 0], ['Nej', 1]].forEach(([kol, v]) => n[kol].forEach(ord => {
        const tr = rader.map((r, k) => r.text.includes(ord) ? k : -1).filter(k => k >= 0);
        kolla(tr.length === 1, `uppgift ${u.nr}: nyckelordet ”${ord}” träffar ${tr.length} rader`);
        if (tr.length === 1) rader[tr[0]].svar = v;
      }));
      const ja = (bedom.match(/^- Ja: (.+)$/m) || [])[1], nej = (bedom.match(/^- Nej: (.+)$/m) || [])[1];
      kolla(n && ja && ja.split(';').length === n.Ja.length && nej && nej.split(';').length === n.Nej.length, `uppgift ${u.nr}: facit och nyckelord har olika antal`);
    } else {
      const bok = kol => ((bedom.match(new RegExp(`^- ${kol}: (.+)$`, 'm')) || [])[1] || '').split(',').map(x => x.trim() + ')');
      const ja = bok('Stämmer'), nej = bok('Stämmer inte');
      rader.forEach(r => { r.svar = ja.includes(r.etikett) ? 0 : nej.includes(r.etikett) ? 1 : null; });
    }
    rader.forEach((r, k) => kolla(r.svar === 0 || r.svar === 1, `uppgift ${u.nr}: rad ${k + 1} saknar facit`));
    block.push(Object.assign({ typ: 'uppgift', id, slag: 'tvaval', kolumner }, /alla kryss står i samma kolumn/i.test(bedom) ? { ogiltigSammaKolumn: true } : {}, { rader }));
  } else if (slag === 'lucktext') {
    const meningar = elev.split('\n').filter(r => /^\d+\. .*______/.test(r)).map(r => r.replace(/^\d+\. /, ''));
    const facit = [];
    let iFacit = false;
    for (const r of bedom.split('\n')) {
      if (/^\*\*Rätta svar:\*\*/.test(r)) { iFacit = true; continue; }
      const m = r.match(/^(\d+)\. (.+)$/);
      if (iFacit && m) facit[+m[1] - 1] = m[2].trim(); else if (iFacit && facit.length && r.trim()) iFacit = false;
    }
    kolla(meningar.length && meningar.length === facit.length, `uppgift ${u.nr}: ${meningar.length} meningar men ${facit.length} facit`);
    kolla(ordbank, `uppgift ${u.nr}: inga begrepp`);
    const rader = meningar.map((m, k) => {
      const [fore, efter] = m.split('______');
      kolla(ordbank && ordbank.includes(facit[k]), `uppgift ${u.nr}: facit ”${facit[k]}” står inte bland begreppen`);
      kolla(BESTAMD[facit[k]], `uppgift ${u.nr}: ingen bestämd form för ”${facit[k]}”`);
      return { fore: stil(fore), efter: stil(efter), svar: [facit[k], ...(BESTAMD[facit[k]] || [])] };
    });
    block.push({ typ: 'uppgift', id, slag: 'lucktext', ordbank, rader });
  } else {
    // Öppen: prompten = mallen med uppgiftens text (elevdelen utan raden om belägg), A-kriteriet (nivåmatrisens tredje
    // cell) och skrivmodellen. Resonera-uppgifter får också Resonera-delen.
    const matris = tabellrader(bedom);
    kolla(matris.length === 2 && /nivå A/.test(celler(matris[0])[2] || ''), `uppgift ${u.nr}: hittar inte nivåmatrisen`);
    const kriterium = matris.length === 2 ? ren(celler(matris[1])[2]) : '';
    const uppgiftText = stycken.filter(s => !/^\*Uppgiften ger möjlighet/.test(s)).map(s => /^>/.test(s)
      ? s.split('\n').map(x => ren(x.replace(/^>\s?/, ''))).join('\n') : ren(s.split('\n').join(' '))).join('\n\n');
    const delar = /^Resonera /m.test(elev) ? modell.slice(0, 2) : modell.slice(0, 1);
    const prompt = MALL.replace('[uppgiftens text]', () => uppgiftText).replace('[A-kriteriet]', () => kriterium).replace('[skrivmodellen]', () => tillPrompt(delar));
    kolla(!/\[(uppgiftens text|A-kriteriet|skrivmodellen|A-exemplet)\]/.test(prompt) && prompt.split(PLATSHALLARE).length === 2, `uppgift ${u.nr}: prompten blev inte ifylld`);
    // Uppslaget (väg 3, Joachims order 2026-11-24): skrivmodellen på en vänstersida och svarsrutan överst på högersidan
    // bredvid (b). Motorn lägger in en utfyllnadssida "Fortsätter på nästa sida" om det behövs.
    block.push({ typ: 'uppgift', id, slag: 'oppen', skrivmodell: tillBok(delar), prompt, platshallare: PLATSHALLARE, hjalp: HJALP,
      till: { skrivmodell: 'vanster', svar: 'hoger' } });
  }
  // En kryssuppgift (tvåval) tar flera sidor och börjar på en vänstersida (c, väg 3): avsnittets till
  avsnitt.push(Object.assign({ id: `uppgift-${u.nr}`, titel: u.titel }, slag === 'janej' || slag === 'stammer' ? { till: 'vanster' } : {}, { block }));
}

// A-exemplen får aldrig följa med: ingen mening ur ett A-exempel i källan får stå i boken
const aExempel = [...delB.matchAll(/\*\*A-exempel[^\n]*\n([\s\S]*?)\n\n\*Kommentar/g)].map(m => m[1]);
const ut = JSON.stringify({ avsnitt }, null, 1);
aExempel.forEach((ex, k) => ex.split('\n').map(r => r.replace(/^>\s?/, '').trim()).filter(r => r.length > 30)
  .forEach(r => kolla(!ut.includes(r.slice(0, 40)), `A-exempel ${k + 1} står i boken: ”${r.slice(0, 40)}…”`)));
kolla(aExempel.length === 3, `väntade tre A-exempel i Del B (för kontrollen), fick ${aExempel.length}`);

if (fel.length) { console.error(fel.join('\n')); process.exit(1); }
fs.writeFileSync(UT, `/* GENERERAD av verktyg/md-till-uppgifter.js ur Joachims samlade material (Del B och Del C) – skriv inte i den här
 * filen för hand. Övningsboken till temat: övningarna ({typ: 'uppgift'}) beskrivs i bokskal/README.md (Övningar).
 * Facit står här (rättningen sker i webbläsaren; det är övningar, inte prov) men ritas aldrig. A-exemplen står inte här. */
Bok.niva('repetitionsbok', ${ut});
`);
console.log(`${path.relative(ROT, UT)}: ${avsnitt.length} uppgifter`);
