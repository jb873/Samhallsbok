#!/usr/bin/env node
/* md-till-uppgifter.js – för in övningarna till ett tema (arbetsorder 2026-11-23) i temats övningsbok,
 * infor-slutprovet/<tema>/innehall/ovningar.js, som motorns övningar ({typ: 'uppgift'}, bokskal/README.md).
 *
 *   node verktyg/md-till-uppgifter.js "<Hämtade filer>/<källa>.md" [tema]
 *     tema I:  Samlat_material_Individ_migration_minoriteter.md (Del B)
 *     tema II: NP-liknande_Styrelseskick_v2.md (hela filen)
 *     tema III: NP-liknande_Lag_och_ratt.md (hela filen)
 *     tema V:  NP-liknande_Media_v2.md (hela filen)
 *     tema IV: NP-liknande_Beslutsfattande.md (hela filen)
 *
 * Ur Joachims material läses bara de NP-liknande uppgifterna (elevdelen och bedömningsanvisningen): Del B i det samlade
 * materialet, eller hela filen när den bara har uppgifterna. Skrivmodellen är kallor/ovningar/skrivmodell.md. A-exemplen
 * läses aldrig in i boken: de stannar i källmaterialet (Joachims beslut 2026-11-23), och verktyget stoppar om en rad ur
 * något av dem skulle stå i boken. Källfilen läggs inte i repot. Det gemensamma med Nationella prov-boken står i
 * verktyg/uppgifter-gemensamt.js.
 *
 * Texten förs över ordagrant: **fet** blir *fet* (motorns enda markering), *kursiv* blir vanlig text. Raden "Bilder och
 * stimulus" är Joachims anteckning, inte elevtext, och raden "Uppgiften ger möjlighet att visa belägg för nivå …" förs
 * aldrig in (eleven ser aldrig nivå eller belägg, som i Nationella prov-boken; arbetsorder 2026-11-26).
 *   Ja/Nej och Stämmer/Stämmer inte → slag 'kryss' (kolumn-kryss; facit: kolumnens index)
 *   lucktext                         → slag 'lucktext' (godkända svar: facit och dess bestämda form, BESTAMD nedan)
 *   flerval ("a) Begrepp" med alternativen som punkter) → slag 'flerval' (facit "- a) <alternativet>")
 *   källtext (> …, utom "Försök att") och tabell utan ☐ → uppgiftens citat och tabell (slag 'citat', 'tabell'; Media,
 *                                      2026-11-25), se lasStimulus i uppgifter-gemensamt.js
 *   öppen                            → slag 'oppen': skrivmodellen och prompten (kallor/ovningar/ai-mall.txt,
 *                                      ifylld med uppgiftens text, A-kriteriet och skrivmodellen)
 * Varje uppgift blir ett numrerat avsnitt (ny sida per uppgift). Stoppar med fel om något inte stämmer. */
'use strict';
const fs = require('fs'), path = require('path');
const G = require('./uppgifter-gemensamt.js');
const { ROT, kolla, stil, ren, celler, tabellrader } = G;
const [KALLA, TEMA = 'individ-migration-minoriteter'] = process.argv.slice(2);

/* Per tema: uppgifternas id-prefix (elevens svar sparas på dem – byt aldrig), facit för Ja/Nej som nyckelord (varje
 * nyckelord ska träffa precis en rad, och antalet ska vara facitets), godkända bestämda former i lucktexten och antalet
 * uppgifter och A-exempel i källan (för kontrollen). */
const TEMAN = {
  'individ-migration-minoriteter': { prefix: 'sam-imm', uppgifter: 6, aExempel: 3,
    nycklar: { 1: { Ja: ['modersmålsundervisning', 'sänder program', 'använda samiska', 'förskola', 'äldreomsorg'],
      Nej: ['betala skatt', 'egna lagar', 'förtur', 'inte behöver följa'] } },
    // BÖJNINGSLISTAN ÄR LÅST: Joachim bekräftade den 2026-11-24. Ändra den bara på hans beslut.
    bestamd: { 'födelseöverskott': ['födelseöverskottet'], 'urbanisering': ['urbaniseringen'], 'assimilation': ['assimilationen'],
      'flykting': ['flyktingen'], 'fri rörlighet': ['fri rörligheten', 'fria rörligheten'], 'socialt arv': ['sociala arvet'],
      'urfolk': ['urfolket'], 'permanent uppehållstillstånd': ['permanenta uppehållstillståndet'] } },
  'styrelseskick': { prefix: 'sam-sty', uppgifter: 6, aExempel: 3,
    nycklar: { 1: { Ja: ['kritiserat landets president', 'torteras', 'förbjuder alla partier', 'från en viss folkgrupp', 'utan rättegång'],
      Nej: ['inte gå på en fest', 'rättvis rättegång', 'betala skatt', 'inte rösta i riksdagsvalet'] } },
    // BÖJNINGSLISTAN ÄR PRELIMINÄR: Joachim bekräftar den innan den låses (arbetsorder 2026-11-24).
    bestamd: { 'maktdelning': ['maktdelningen'], 'enpartistat': ['enpartistaten'], 'teokrati': ['teokratin'], 'censur': ['censuren'],
      'konvention': ['konventionen'], 'civil olydnad': ['civila olydnaden'], 'folkrörelse': ['folkrörelsen'], 'naturrätt': ['naturrätten'] } },
  'lag-och-ratt': { prefix: 'sam-lag', uppgifter: 6, aExempel: 3,
    nycklar: { 1: { Ja: ['köpa ut alkohol', 'nakenbild', 'köra bil', 'ljuga som vittne', 'hota ett vittne'],
      Nej: ['hälsa på sina grannar', 'keps', 'tränga sig', 'demonstration'] } },
    // BÖJNINGSLISTAN ÄR LÅST: Joachim bekräftade den 2026-11-25. Ändra den bara på hans beslut. Varianterna ur källans
    // förslag: bestämd form, "en polisstat" och "prejudikat" i lucka 5.
    bestamd: { 'rättssäkerhet': ['rättssäkerheten'], 'polisstat': ['polisstaten', 'en polisstat'], 'offentlighetsprincipen': [],
      'överklaga': [], 'prejudicerande': ['prejudikat'], 'tvistemål': ['tvistemålet'], 'resning': ['resningen'], 'uppsåt': ['uppsåtet'] } },
  // Media (arbetsorder 2026-11-25): ingen lucktext, alltså ingen böjningslista
  'media': { prefix: 'sam-med', uppgifter: 6, aExempel: 3,
    nycklar: { 1: { Ja: ['starta en egen tidning', 'läsa allmänna handlingar', 'kritisera regeringen', 'citera en del'],
      Nej: ['tar reda på vem', 'tv-reklam', 'influencer', 'falskt påstå', 'kopiera någon annans bilder'] } },
    bestamd: {} },
  // Beslutsfattande (arbetsorder 2026-11-26). Facit till Ja/Nej i uppgift 1 är beskrivande i md:n: Joachims mappning i
  // radordningen (facitrader, rad 1 = den första raden). Skrivmodellen satt per öppen uppgift (md:n har ingen Typ-rad).
  // Inga notiser, inga bilder.
  'beslutsfattande': { prefix: 'sam-bes', uppgifter: 6, aExempel: 3, nycklar: {},
    facitrader: { 1: { Ja: [1, 3, 6, 7, 9], Nej: [2, 4, 5, 8] } },
    modell: { 4: 'Redogöra', 5: 'Redogöra', 6: 'Resonera' },
    // Böjningslistan till uppgift 2: Joachims lista i arbetsordern 2026-11-26. Ändra den bara på hans beslut.
    bestamd: { 'parlamentarism': ['parlamentarismen'], 'fyraprocentsspärren': ['spärren'], 'politisk vilde': ['en politisk vilde', 'politiska vilden'],
      'misstroendeförklaring': ['misstroendeförklaringen'], 'JO': ['Justitieombudsmannen'], 'ministerstyre': ['ministerstyret'],
      'subsidiaritetsprincipen': ['subsidiaritetsprincip'], 'förordning': ['förordningen'] } }
};
const T = TEMAN[TEMA];
if (!KALLA || !T) { console.error('Ange källfilen och ett tema som finns i TEMAN.'); process.exit(1); }
const UT = path.join(ROT, 'infor-slutprovet', TEMA, 'innehall', 'ovningar.js');

const md = fs.readFileSync(KALLA, 'utf8').replace(/\r\n/g, '\n');
const delB = md.includes('\n# Del B') ? G.delAv(md, '\n# Del B', '\n# Del C') : md;
const modell = G.lasModell(G.SKRIVMODELL);

const bitar = delB.split(/\n## Uppgift (\d+) – (.+)\n/).slice(1);
const uppgifter = [];
for (let i = 0; i < bitar.length; i += 3) uppgifter.push({ nr: +bitar[i], titel: bitar[i + 1].trim(), kropp: bitar[i + 2] });
kolla(uppgifter.length === T.uppgifter, `väntade ${T.uppgifter} uppgifter, fick ${uppgifter.length}`);

const avsnitt = [];
for (const u of uppgifter) {
  const [elev0, bedom] = u.kropp.split('\n### Bedömningsanvisning\n');
  kolla(bedom, `uppgift ${u.nr}: ingen bedömningsanvisning`);
  if (!bedom) continue;
  // (raden "Uppgiften ger möjlighet att visa belägg för nivå …" står aldrig i boken: eleven ser aldrig nivå eller belägg,
  // som i Nationella prov-boken – Joachims arbetsorder 2026-11-26)
  const elev = elev0.split('\n').filter(r => !/^\*\*Bilder och stimulus:\*\*/.test(r) && !/^\*?Uppgiften ger möjlighet att visa belägg/.test(r.trim())).join('\n');
  const id = `${T.prefix}-u${u.nr}`, block = [];
  // Kryssets tabell: raderna i en tabell med ☐ (tabellens rader i följd). En tabell utan ☐ är uppgiftens tabell och står
  // kvar i texten (lasStimulus).
  const tabeller = elev.split('\n').reduce((t, r, k, a) => { if (/^\|/.test(r)) { if (!(k && /^\|/.test(a[k - 1]))) t.push([]); t[t.length - 1].push(r); } return t; }, []);
  const kryssrader = new Set(tabeller.filter(t => t.some(r => /☐/.test(r))).flat());
  const tabell = tabellrader([...kryssrader].join('\n'));
  // En bildrad ("[Bild: …]") är Joachims anteckning om en bild som inte finns i boken: den förs inte in
  const stycken = elev.split('\n').map(r => kryssrader.has(r) ? '' : r).join('\n')
    .split(/\n\s*\n/).map(s => s.trim()).filter(s => s && !/^\[Bild: .*\]$/.test(s));
  const slag = tabell.length && /^\| Ja \| Nej \|/.test(tabell[0]) ? 'janej' : tabell.length && /Stämmer \| Stämmer inte/.test(tabell[0]) ? 'stammer'
    : /\nBegrepp: /.test(elev) ? 'lucktext' : stycken.some(G.arFlerval) ? 'flerval' : 'oppen';
  let ordbank = null;
  const raknare = { citat: 0, tabell: 0 }, fler = [], prompttext = [];

  // Elevdelens stycken, i ordning. Tabellen, begreppen och lucktextens meningar står i övningsblocket.
  for (let i = 0; i < stycken.length; i++) {
    const s = stycken[i], stim = G.lasStimulus(stycken, i, id, raknare);
    // uppgiftens text till prompten (de öppna): som den står, utan raden om belägg
    if (!/^\*Uppgiften ger möjlighet/.test(s) && !stim) prompttext.push(/^>/.test(s)
      ? s.split('\n').map(x => ren(x.replace(/^>\s?/, ''))).join('\n') : ren(s.split('\n').join(' ')));
    if (stim) {                                           // källtext eller tabell: uppgiftens citat eller tabell
      block.push(stim.block);
      prompttext.push(stim.prompt);
      i += stim.steg - 1;
    } else if (slag === 'flerval' && G.arFlerval(s)) fler.push(G.flervalRad(s));   // en rad i flervalet
    else if (/^>/.test(s)) {                              // > **Försök att:** och punkterna
      const r = s.split('\n').map(x => x.replace(/^>\s?/, ''));
      kolla(/^\*\*Försök att:\*\*$/.test(r[0]), `uppgift ${u.nr}: oväntad ruta ”${r[0]}”`);
      block.push({ typ: 'ruta', rubrik: 'Försök att:', punkter: r.slice(1).map(x => stil(x.replace(/^- /, ''))).filter(Boolean) });
    } else if (/^Begrepp: /.test(s)) ordbank = s.replace(/^Begrepp: /, '').split(',').map(x => x.trim());
    else if (!/^\d+\. .*______/.test(s)) block.push({ typ: 'text', text: s.split('\n').map(stil).join(' ') });
  }

  if (slag === 'janej' || slag === 'stammer') {
    const kolumner = slag === 'janej' ? ['Ja', 'Nej'] : ['Stämmer', 'Stämmer inte'];
    const rader = tabell.slice(1).map(r => { const c = celler(r); return slag === 'janej' ? { text: stil(c[2]) } : { etikett: c[0], text: stil(c[1]) }; });
    if (slag === 'janej' && (T.facitrader || {})[u.nr]) {
      // facit som radnummer (tema IV): varje rad i precis en kolumn, och antalet som i md:ns beskrivande facit
      const f = T.facitrader[u.nr];
      rader.forEach((r, k) => { r.svar = f.Ja.includes(k + 1) ? 0 : f.Nej.includes(k + 1) ? 1 : null; });
      kolla(f.Ja.length + f.Nej.length === rader.length && !f.Ja.some(k => f.Nej.includes(k)), `uppgift ${u.nr}: facitraderna täcker inte raderna en gång var`);
      const ja = (bedom.match(/^- Ja(?: \([^)]*\))?: (.+)$/m) || [])[1], nej = (bedom.match(/^- Nej(?: \([^)]*\))?: (.+)$/m) || [])[1];
      kolla(ja && ja.split(';').length === f.Ja.length && nej && nej.split(';').length === f.Nej.length, `uppgift ${u.nr}: facit och facitraderna har olika antal`);
    } else if (slag === 'janej') {
      const n = T.nycklar[u.nr];
      G.facitMedNycklar(u.nr, rader, n);
      const ja = (bedom.match(/^- Ja(?: \([^)]*\))?: (.+)$/m) || [])[1], nej = (bedom.match(/^- Nej(?: \([^)]*\))?: (.+)$/m) || [])[1];
      kolla(n && ja && ja.split(';').length === n.Ja.length && nej && nej.split(';').length === n.Nej.length, `uppgift ${u.nr}: facit och nyckelord har olika antal`);
    } else {
      const bok = kol => ((bedom.match(new RegExp(`^- ${kol}: (.+)$`, 'm')) || [])[1] || '').split(',').map(x => x.trim() + ')');
      const ja = bok('Stämmer'), nej = bok('Stämmer inte');
      rader.forEach(r => { r.svar = ja.includes(r.etikett) ? 0 : nej.includes(r.etikett) ? 1 : null; });
    }
    rader.forEach((r, k) => kolla(r.svar === 0 || r.svar === 1, `uppgift ${u.nr}: rad ${k + 1} saknar facit`));
    block.push(Object.assign({ typ: 'uppgift', id, slag: 'kryss', kolumner }, /alla kryss står i samma kolumn/i.test(bedom) ? { ogiltigSammaKolumn: true } : {}, { rader }));
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
      kolla(T.bestamd[facit[k]], `uppgift ${u.nr}: ingen bestämd form för ”${facit[k]}”`);
      return { fore: stil(fore), efter: stil(efter), svar: [facit[k], ...(T.bestamd[facit[k]] || [])] };
    });
    block.push({ typ: 'uppgift', id, slag: 'lucktext', ordbank, rader });
  } else if (slag === 'flerval') {
    block.push({ typ: 'uppgift', id, slag: 'flerval', rader: G.flervalRader(u.nr, fler, bedom) });
  } else {
    // Öppen: prompten = mallen med uppgiftens text (elevdelen utan raden om belägg), A-kriteriet (nivåmatrisens tredje
    // cell) och skrivmodellen. Resonera-uppgifter får också Resonera-delen.
    const matris = tabellrader(bedom);
    kolla(matris.length === 2 && /nivå A/.test(celler(matris[0])[2] || ''), `uppgift ${u.nr}: hittar inte nivåmatrisen`);
    const kriterium = matris.length === 2 ? ren(celler(matris[1])[2]) : '';
    // (skrivmodellen satt per uppgift i TEMAN, tema IV; annars efter uppgiftens "Resonera …")
    const satt = (T.modell || {})[u.nr];
    if (T.modell) kolla(satt === 'Redogöra' || satt === 'Resonera', `uppgift ${u.nr}: ingen skrivmodell i TEMAN`);
    block.push(G.oppenUppgift(id, u.nr, prompttext.join('\n\n'), kriterium, satt ? modell.slice(0, satt === 'Resonera' ? 2 : 1) : G.modellFor(modell, elev)));
  }
  // En kryssuppgift tar flera sidor och börjar på en vänstersida (c, väg 3): avsnittets till
  avsnitt.push(Object.assign({ id: `uppgift-${u.nr}`, titel: u.titel }, slag === 'janej' || slag === 'stammer' || slag === 'flerval' ? { till: 'vanster' } : {}, { block }));
}

const bok = G.skrivBok(UT, `/* GENERERAD av verktyg/md-till-uppgifter.js ur Joachims samlade material (Del B och Del C) – skriv inte i den här
 * filen för hand. Övningsboken till temat: övningarna ({typ: 'uppgift'}) beskrivs i bokskal/README.md (Övningar).
 * Facit står här (rättningen sker i webbläsaren; det är övningar, inte prov) men ritas aldrig. A-exemplen står inte här. */`, avsnitt);
G.citatSparr(uppgifter.map(u => u.kropp.split('\n### Bedömningsanvisning\n')[1] || ''), bok.json);
G.aExempelSparr([...delB.matchAll(/\*\*A-exempel[^\n]*\n([\s\S]*?)\n\n\*Kommentar/g)].map(m => m[1]), bok.json, T.aExempel);
G.stoppaVidFel();
bok.skriv();
console.log(`${path.relative(ROT, UT)}: ${avsnitt.length} uppgifter`);
