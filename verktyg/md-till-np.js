#!/usr/bin/env node
/* md-till-np.js – för in de riktiga NP-uppgifterna till ett tema (arbetsorder 2026-11-24) i temats Nationella
 * prov-bok, infor-slutprovet/<tema>/innehall/nationella-prov.js, med samma övningar som Öva-boken ({typ: 'uppgift'},
 * bokskal/README.md): inga nya typer, inget nytt i motorn.
 *
 *   node verktyg/md-till-np.js "<Hämtade filer>/Samlat_material_Individ_migration_minoriteter.md" [tema]
 *
 * Ur Joachims samlade material läses Del A (uppgifterna ordagrant ur NP 2016–2018 med NP:s facit och bedömning) och
 * Del C (skrivmodellen); AI-mallen är kallor/ovningar/ai-mall.txt, som i Öva-boken. A-exemplen läses aldrig in i boken:
 * de stannar i källmaterialet, och verktyget stoppar om en rad ur något A-exempel (Del A eller Del B) skulle stå i
 * boken. Källfilen läggs inte i repot. Det gemensamma med Öva-boken står i verktyg/uppgifter-gemensamt.js.
 *
 * Texten förs över ordagrant (**fet** blir *fet*, *kursiv* vanlig text). Ett stycke med flera rader i källan står kvar
 * rad för rad (blocket rader). Ur uppgiftens huvud tas bara källan ("Källa: vt 2017, delprov A, uppgift A10"); typ,
 * nivå och Joachims anteckningar är inte elevtext. En bildrad ("[Bild: …]") blir uppgiftens bild (slag 'bild', ingen
 * figur – arbetsorder 2026-11-24) där den står, före "Tips i provet" som på NP, men bara om bilden finns i BILDER nedan;
 * annars förs raden inte in.
 *   lucktext        → 'lucktext' (godkända svar: facit och dess bestämda form, BESTAMD nedan)
 *   stämmer/stämmer inte, Ja/Nej → 'tvaval' (Stämmer/Ja = 0, Stämmer inte/Nej = 1)
 *   öppen           → 'oppen': skrivmodellen och prompten (uppgiftens text, A-kriteriet ur NP:s matris, skrivmodellen)
 * Uppslaget (väg 3): lucktexten och kryssuppgifterna börjar på en vänstersida; i de öppna står skrivmodellen till
 * vänster och svarsrutan överst till höger. Gränserna (E/C/A) används inte: eleven ser antal rätt, aldrig nivå. */
'use strict';
const fs = require('fs'), path = require('path');
const G = require('./uppgifter-gemensamt.js');
const { ROT, kolla, stil, ren, celler, tabellrader } = G;
const [KALLA, TEMA = 'individ-migration-minoriteter'] = process.argv.slice(2);
const PREFIX = { 'individ-migration-minoriteter': 'sam-np-imm' };   // uppgifternas id (elevens svar sparas på dem – byt aldrig)
const UT = path.join(ROT, 'infor-slutprovet', TEMA, 'innehall', 'nationella-prov.js');
if (!KALLA || !PREFIX[TEMA]) { console.error('Ange källfilen (Samlat_material_….md) och ett tema med prefix i PREFIX.'); process.exit(1); }

const md = fs.readFileSync(KALLA, 'utf8').replace(/\r\n/g, '\n');
const delA = G.delAv(md, '\n# Del A', '\n# Del B'), delB = G.delAv(md, '\n# Del B', '\n# Del C'), delC = G.delAv(md, '\n# Del C', '\n# Del D');
const modell = G.lasModell(delC);

const bitar = delA.split(/\n## Uppgift (\d+) – (\d{4} [AB]\d+) – (.+)\n/).slice(1);
const uppgifter = [];
for (let i = 0; i < bitar.length; i += 4) uppgifter.push({ nr: +bitar[i], kod: bitar[i + 1], titel: bitar[i + 2].trim(), kropp: bitar[i + 3] });
kolla(uppgifter.length === 7, `Del A: väntade sju uppgifter, fick ${uppgifter.length}`);

// Facit för Ja/Nej står som beskrivningar i NP:s bedömning: varje nyckelord ska träffa precis en rad
const JA_NEJ_NYCKLAR = {
  'individ-migration-minoriteter': { 4: { Ja: ['rullstol', 'sämre meriter', 'homosexuellt par', 'graviditet'],
    Nej: ['kepsförbud', 'välja skola', 'sänkt betyg', 'lunchalternativ', 'slutat på skolan'] } }
}[TEMA] || {};
// Godkända svar i lucktexten utöver facit: bestämd form (som Öva-boken; stora och små bokstäver sköter motorn).
// BÖJNINGSLISTAN ÄR LÅST: Joachim bekräftade den 2026-11-24. Ändra den bara på hans beslut.
const BESTAMD = {
  'asyl': ['asylen'], 'flykting': ['flyktingen'], 'visum': ['visumet'], 'migration': ['migrationen'],
  'integration': ['integrationen'], 'segregation': ['segregationen'], 'migrationsverket': [], 'emigration': ['emigrationen']
};
const liten = s => s.toLowerCase();
// Uppgifternas bilder (arbetsorder 2026-11-24), i temasidans bilder/. Bara godkända bilder: uppgift 3 har ingen (© UNHCR,
// publiceras inte), och uppgift 6 väntar på en karta som visar var folk bor (NP-PDF:ens bild är bara Sveriges kontur).
// En post: nr: {fil: 'bilder/…', bredd, hojd (pixlar), beskrivning, kalla}
const BILDER = { 'individ-migration-minoriteter': {} }[TEMA] || {};

const avsnitt = [];
for (const u of uppgifter) {
  const [huvudOchElev, bedom] = u.kropp.split('\n### Bedömningsanvisning (NP)\n');
  kolla(bedom, `uppgift ${u.nr}: ingen bedömningsanvisning`);
  if (!bedom) continue;
  // Huvudet: punkterna Källa, Typ, Nivå, Sekundärt område, Varför Övrigt. Bara källan förs in.
  const huvud = huvudOchElev.split('\n').filter(r => /^- \*\*[^*]+:\*\*/.test(r));
  const kalla = (huvud.find(r => /^- \*\*Källa:\*\*/.test(r)) || '').replace(/^- \*\*Källa:\*\*\s*/, '');
  kolla(kalla, `uppgift ${u.nr}: ingen källa`);
  const elev = huvudOchElev.split('\n').filter(r => !/^- \*\*[^*]+:\*\*/.test(r)).join('\n');
  const stycken = elev.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
  const id = `${PREFIX[TEMA]}-u${u.nr}`, block = [{ typ: 'text', text: `Källa: ${kalla}` }];
  const radlista = s => s.split('\n').map(x => x.trim());
  const arLucka = s => /^\d+\. .*______/.test(s), arPastaenden = s => radlista(s).every(x => /^[a-z]\) /.test(x)), arLista = s => radlista(s).every(x => /^- /.test(x));
  const slag = stycken.some(s => /^Begrepp: /.test(s)) ? 'lucktext' : stycken.some(arPastaenden) ? 'stammer' : stycken.some(arLista) ? 'janej' : 'oppen';
  let ordbank = null;
  const prompttext = [];                               // uppgiftens text till AI-mallen: elevdelen utan källan

  for (const s of stycken) {
    if (/^\[Bild: .*\]$/.test(s)) {                  // uppgiftens bild, där den står (eller ingenting)
      if (BILDER[u.nr]) block.push({ typ: 'uppgift', id: `${id}-bild`, slag: 'bild', bild: BILDER[u.nr] });
    } else if (/^\*Tips i provet:\*/.test(s)) {
      block.push({ typ: 'ruta', rubrik: 'Tips i provet:', text: stil(s.replace(/^\*Tips i provet:\*\s*/, '')) });
      prompttext.push(ren(s));
    } else if (/^Begrepp: /.test(s)) ordbank = s.replace(/^Begrepp: /, '').split(',').map(x => x.trim());
    else if (arLucka(s) || arPastaenden(s) || arLista(s)) { /* raderna står i övningsblocket */ }
    else {
      const r = radlista(s);
      block.push(r.length > 1 ? { typ: 'rader', rader: r.map(stil) } : { typ: 'text', text: stil(r[0]) });
      prompttext.push(r.map(ren).join('\n'));
    }
  }

  if (slag === 'stammer' || slag === 'janej') {
    const kolumner = slag === 'janej' ? ['Ja', 'Nej'] : ['Stämmer', 'Stämmer inte'];
    const rader = slag === 'stammer'
      ? radlista(stycken.find(arPastaenden)).map(x => { const m = x.match(/^([a-z]\)) (.+)$/); return { etikett: m[1], text: stil(m[2]) }; })
      : radlista(stycken.find(arLista)).map(x => ({ text: stil(x.replace(/^- /, '')) }));
    if (slag === 'stammer') {
      const bok = kol => ((bedom.match(new RegExp(`^- ${kol}: (.+)$`, 'm')) || [])[1] || '').split(',').map(x => x.trim() + ')');
      const ja = bok('Stämmer'), nej = bok('Stämmer inte');
      rader.forEach(r => { r.svar = ja.includes(r.etikett) ? 0 : nej.includes(r.etikett) ? 1 : null; });
    } else {
      const n = JA_NEJ_NYCKLAR[u.nr];
      G.facitMedNycklar(u.nr, rader, n);
      const ja = (bedom.match(/^- Ja(?: \([^)]*\))?: (.+)$/m) || [])[1], nej = (bedom.match(/^- Nej: (.+)$/m) || [])[1];
      kolla(n && ja && ja.split(';').length === n.Ja.length && nej && nej.split(';').length === n.Nej.length, `uppgift ${u.nr}: facit och nyckelord har olika antal`);
    }
    rader.forEach((r, k) => kolla(r.svar === 0 || r.svar === 1, `uppgift ${u.nr}: rad ${k + 1} saknar facit`));
    block.push(Object.assign({ typ: 'uppgift', id, slag: 'tvaval', kolumner }, /alla kryss (står )?i samma kolumn/i.test(bedom) ? { ogiltigSammaKolumn: true } : {}, { rader }));
  } else if (slag === 'lucktext') {
    const meningar = elev.split('\n').filter(arLucka).map(r => r.replace(/^\d+\. /, ''));
    const facit = [];
    let iFacit = false;
    for (const r of bedom.split('\n')) {
      if (/^\*\*Facit:\*\*/.test(r)) { iFacit = true; continue; }
      const m = r.match(/^(\d+)\. (.+)$/);
      if (iFacit && m) facit[+m[1] - 1] = m[2].trim(); else if (iFacit && facit.length && r.trim()) iFacit = false;
    }
    kolla(meningar.length && meningar.length === facit.length, `uppgift ${u.nr}: ${meningar.length} meningar men ${facit.length} facit`);
    kolla(ordbank, `uppgift ${u.nr}: inga begrepp`);
    const rader = meningar.map((m, k) => {
      const [fore, efter] = m.split('______');
      kolla(ordbank && ordbank.map(liten).includes(liten(facit[k])), `uppgift ${u.nr}: facit ”${facit[k]}” står inte bland begreppen`);
      kolla(BESTAMD[liten(facit[k])], `uppgift ${u.nr}: ingen rad i böjningslistan för ”${facit[k]}”`);
      return { fore: stil(fore), efter: stil(efter), svar: [facit[k], ...(BESTAMD[liten(facit[k])] || [])] };
    });
    block.push({ typ: 'uppgift', id, slag: 'lucktext', ordbank, rader });
  } else {
    // Öppen: A-kriteriet är den tredje cellen i NP:s matris (| E | C | A |)
    const matris = tabellrader(bedom);
    kolla(matris.length === 2 && celler(matris[0])[2] === 'A', `uppgift ${u.nr}: hittar inte nivåmatrisen`);
    const kriterium = matris.length === 2 ? ren(celler(matris[1])[2]) : '';
    block.push(G.oppenUppgift(id, u.nr, prompttext.join('\n\n'), kriterium, G.modellFor(modell, elev)));
  }
  // Uppslaget (väg 3): lucktexten och kryssuppgifterna börjar på en vänstersida (begreppen och raderna till vänster)
  avsnitt.push(Object.assign({ id: `uppgift-${u.nr}`, titel: u.titel }, slag === 'oppen' ? {} : { till: 'vanster' }, { block }));
}

const bok = G.skrivBok(UT, `/* GENERERAD av verktyg/md-till-np.js ur Joachims samlade material (Del A och Del C) – skriv inte i den här filen
 * för hand. Nationella prov-boken till temat: uppgifterna ordagrant ur nationella proven 2016–2018, som motorns övningar
 * ({typ: 'uppgift'}, bokskal/README.md). Facit står här (rättningen sker i webbläsaren) men ritas aldrig. A-exemplen
 * står inte här. */`, avsnitt);
// A-exemplen i Del A (NP:s elevsvar) och i Del B: ingen rad ur något av dem får stå i boken
const aExempel = [...delA.matchAll(/\*\*A-exempel[^\n]*\n([\s\S]*?)\n\n\*\*Bedömningskommentar/g), ...delB.matchAll(/\*\*A-exempel[^\n]*\n([\s\S]*?)\n\n\*Kommentar/g)].map(m => m[1]);
G.aExempelSparr(aExempel, bok.json, 7);
G.stoppaVidFel();
bok.skriv();
console.log(`${path.relative(ROT, UT)}: ${avsnitt.length} uppgifter`);
