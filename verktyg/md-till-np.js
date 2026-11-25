#!/usr/bin/env node
/* md-till-np.js – för in de riktiga NP-uppgifterna till ett tema (arbetsorder 2026-11-24) i temats Nationella
 * prov-bok, infor-slutprovet/<tema>/innehall/nationella-prov.js, med samma övningar som Öva-boken ({typ: 'uppgift'},
 * bokskal/README.md).
 *
 *   node verktyg/md-till-np.js "<Hämtade filer>/<källa>.md" [tema]
 *     tema I:  Samlat_material_Individ_migration_minoriteter.md (Del A)
 *     tema II: NP_styrelseskick_med_bedomning_v2.md (hela filen)
 *     tema III: NP_lag_och_ratt_med_bedomning.md (hela filen)
 *     tema V:  NP_media_med_bedomning_v2.md (hela filen)
 *
 * Ur Joachims material läses NP-uppgifterna ordagrant med NP:s facit och bedömning (Del A i det samlade materialet, eller
 * hela filen när den bara har uppgifterna). Skrivmodellen är kallor/ovningar/skrivmodell.md och AI-mallen
 * kallor/ovningar/ai-mall.txt, som i Öva-boken. A-exemplen läses aldrig in i boken: de stannar i källmaterialet, och
 * verktyget stoppar om en rad ur något A-exempel skulle stå i boken. Källfilen läggs inte i repot. Det gemensamma med
 * Öva-boken står i verktyg/uppgifter-gemensamt.js.
 *
 * Texten förs över ordagrant (**fet** blir *fet*, *kursiv* vanlig text). Ett stycke med flera rader i källan står kvar
 * rad för rad (blocket rader). Ur uppgiftens huvud tas bara källan ("Källa: vt 2017, delprov A, uppgift A10"); typ, nivå,
 * "Bilder och stimulus" och Joachims anteckningar är inte elevtext. En bildrad ("[Bild: …]") blir uppgiftens bild (slag
 * 'bild', ingen figur) där den står, före "Tips i provet" som på NP, men bara om bilden finns i temats bilder; annars förs
 * raden inte in. Har uppgiften rubriken "### Uppgift" är elevtexten det som står efter den (före den: Joachims anteckningar
 * om bilderna och deras licenser). Källtexter och tabeller (Media, 2026-11-25) blir uppgiftens citat (slag 'citat', med
 * rubrik, listor och en sista rad "Källa: …" som källa) och tabeller (slag 'tabell'), se lasStimulus i
 * uppgifter-gemensamt.js. Svarsraderna på provet ("1: ______") förs inte in: svarsrutan ersätter dem.
 *   lucktext   → 'lucktext' (godkända svar: facit och dess bestämda form). Meningarna är numrerade eller ett stycke där
 *                varje rad har en lucka; en rad med två luckor blir två rader. Facit är numrerat eller meningarna med
 *                svaret i fetstil. Utbytbara luckor (utbytbara i TEMAN) godkänner varandras svar, men inte samma
 *                begrepp två gånger (olika).
 *   flerval    → 'kryss' (kolumn-kryss, arbetsorder 2026-11-24). Raderna är a), b) … eller 1., 2. … eller punkter. Har en
 *                uppgift numrerade rader är raderna med bokstav texter (som "a) Markera …" i 2017 B1). Ett stycke med
 *                rader blir ett block: texten före raderna i samma stycke är blockets text, "Kolumner: A / B" dess
 *                kolumner; ett stycke utan rader mellan två block är nästa blocks text. Kolumnerna står annars i facit
 *                ("Stämmer: a, c" eller "a) Demokrati: 1, 5 · Diktatur: 2, 3" eller "1. … : direkt demokrati").
 *   flerval med alternativ → 'flerval' (2018 A3): varje stycke "a) Begrepp" med alternativen som punkter under är en
 *                rad; facit "- a) Begrepp: <alternativet>" pekar ut alternativet (Joachims beslut 2026-11-25).
 *   kryss i en markdowntabell (☐, Media 2016 B8 och A8) → 'kryss', ett kolumn-kryss per tabell där tabellen står, med
 *                kolumnerna ur tabellhuvudet (kolumnerna med ☐). Facit: en tabell i bedömningen (kolumn n för den n:te
 *                tabellen, raderna i ordning) eller "- Kolumn: a, b, …". Flera tabeller i en uppgift (2016 B8, Joachims
 *                beslut 2026-11-25): var sitt kryss med var sin Rätta, id …-1, …-2.
 *   öppen      → 'oppen': skrivmodellen och prompten (uppgiftens text, A-kriteriet ur NP:s matris, skrivmodellen)
 * Uppslaget (väg 3): lucktexten och kryssuppgifterna börjar på en vänstersida; i de öppna står skrivmodellen till
 * vänster och svarsrutan överst till höger. Gränserna (E/C/A) används inte: eleven ser antal rätt, aldrig nivå. En
 * resonerande uppgift (typen innehåller "resonerande") får skrivmodellens Redogöra och Resonera, de andra Redogöra. */
'use strict';
const fs = require('fs'), path = require('path');
const G = require('./uppgifter-gemensamt.js');
const { ROT, kolla, stil, ren, celler, tabellrader } = G;
const [KALLA, TEMA = 'individ-migration-minoriteter'] = process.argv.slice(2);

/* Per tema: id-prefix (elevens svar sparas på dem – byt aldrig), antalet uppgifter och A-exempel i källan (för
 * kontrollen), facit för Ja/Nej som nyckelord där NP beskriver raderna i stället för att numrera dem, godkända bestämda
 * former i lucktexten och uppgifternas bilder (i temasidans bilder/, bara godkända: nr: {fil, bredd, hojd, beskrivning,
 * kalla}). */
const TEMAN = {
  'individ-migration-minoriteter': { prefix: 'sam-np-imm', uppgifter: 7, aExempel: 7,
    nycklar: { 4: { Ja: ['rullstol', 'sämre meriter', 'homosexuellt par', 'graviditet'],
      Nej: ['kepsförbud', 'välja skola', 'sänkt betyg', 'lunchalternativ', 'slutat på skolan'] } },
    // BÖJNINGSLISTAN ÄR LÅST: Joachim bekräftade den 2026-11-24. Ändra den bara på hans beslut.
    bestamd: { 'asyl': ['asylen'], 'flykting': ['flyktingen'], 'visum': ['visumet'], 'migration': ['migrationen'],
      'integration': ['integrationen'], 'segregation': ['segregationen'], 'migrationsverket': [], 'emigration': ['emigrationen'] },
    // Uppgift 3 har ingen bild (© UNHCR, publiceras inte); uppgift 6 väntar på en karta som visar var folk bor (bilden i
    // NP-PDF:en är bara Sveriges kontur)
    bilder: {} },
  'styrelseskick': { prefix: 'sam-np-sty', uppgifter: 8, aExempel: 4, nycklar: {}, bestamd: {}, bilder: {} },
  'lag-och-ratt': { prefix: 'sam-np-lag', uppgifter: 5, aExempel: 2, nycklar: {},
    // BÖJNINGSLISTAN ÄR LÅST: Joachim bekräftade den 2026-11-25. Ändra den bara på hans beslut.
    bestamd: { 'gripen': [], 'åklagare': ['åklagaren'], 'anhållen': [], 'försvarsadvokat': ['försvarsadvokaten'],
      'målsägande': ['målsäganden'], 'tilltalad': ['den tilltalade'], 'vittne': ['vittnet'], 'fängelse': ['fängelset'],
      'dagsböter': ['dagsböterna'], 'nämndemännen': [] },
    // Luckor där facit kan stå i vilken ordning som helst ("till exempel fängelse eller dagsböter"): båda godkänns i båda,
    // men inte samma begrepp två gånger (olika i motorn). Joachim 2026-11-25: valfri ordning, inte NP:s strikta.
    utbytbara: { 1: [['fängelse', 'dagsböter']] },
    // Uppgift 5 har ingen bild (Joachim 2026-11-25: dekor, och ett foto på en namngiven person)
    bilder: {} },
  // Media (arbetsorder 2026-11-25): ingen lucktext, alltså ingen böjningslista. Alla bilder utelämnas (dekor eller ©):
  // de fyra fotona i uppgift 1 och nyhetsstudion i uppgift 6.
  'media': { prefix: 'sam-np-med', uppgifter: 14, aExempel: 8, nycklar: {}, bestamd: {}, bilder: {} }
};
const T = TEMAN[TEMA];
if (!KALLA || !T) { console.error('Ange källfilen och ett tema som finns i TEMAN.'); process.exit(1); }
const UT = path.join(ROT, 'infor-slutprovet', TEMA, 'innehall', 'nationella-prov.js');

const md = fs.readFileSync(KALLA, 'utf8').replace(/\r\n/g, '\n');
const samlat = md.includes('\n# Del A');
const delA = samlat ? G.delAv(md, '\n# Del A', '\n# Del B') : md;
const modell = G.lasModell(G.SKRIVMODELL);

const bitar = delA.split(/\n## Uppgift (\d+) – (\d{4} [AB]\d+) – (.+)\n/).slice(1);
const uppgifter = [];
for (let i = 0; i < bitar.length; i += 4) uppgifter.push({ nr: +bitar[i], kod: bitar[i + 1], titel: bitar[i + 2].trim(), kropp: bitar[i + 3] });
kolla(uppgifter.length === T.uppgifter, `väntade ${T.uppgifter} uppgifter, fick ${uppgifter.length}`);

const liten = s => s.toLowerCase();
const versal = s => s.charAt(0).toUpperCase() + s.slice(1);
const radlista = s => s.split('\n').map(x => x.trim());

const avsnitt = [];
for (const u of uppgifter) {
  const [huvudOchElev, bedom] = u.kropp.split('\n### Bedömningsanvisning (NP)\n');
  kolla(bedom, `uppgift ${u.nr}: ingen bedömningsanvisning`);
  if (!bedom) continue;
  // Huvudet: punkterna Källa, Typ, Nivå, Sekundärt område, Varför Övrigt. Bara källan förs in; typen styr uppgiften.
  const huvud = huvudOchElev.split('\n').filter(r => /^- \*\*[^*]+:\*\*/.test(r));
  const falt = n => (huvud.find(r => r.startsWith(`- **${n}:**`)) || '').replace(/^- \*\*[^*]+:\*\*\s*/, '');
  const kalla = falt('Källa'), typ = falt('Typ');
  kolla(kalla, `uppgift ${u.nr}: ingen källa`);
  kolla(typ, `uppgift ${u.nr}: ingen typ`);
  // elevtexten: efter "### Uppgift" där rubriken finns (före den står Joachims anteckningar om bilderna, Media)
  const uppgiftsdel = huvudOchElev.includes('\n### Uppgift\n') ? huvudOchElev.slice(huvudOchElev.indexOf('\n### Uppgift\n')) : huvudOchElev;
  const elev = uppgiftsdel.split('\n').filter(r => !/^- \*\*[^*]+:\*\*/.test(r) && !/^\*\*Bilder och stimulus:\*\*/.test(r) && !/^### Uppgift\s*$/.test(r)).join('\n');
  const stycken = elev.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
  const id = `${T.prefix}-u${u.nr}`, block = [{ typ: 'text', text: `Källa: ${kalla}` }];
  let slag = /^lucktext/.test(typ) ? 'lucktext' : /^flerval/.test(typ) || /☐/.test(elev) ? 'kryss' : 'oppen';
  // lucktextens meningar: numrerade ("1. … ______") eller ett stycke där varje rad har en lucka (2017 B4)
  const arLuckrad = x => slag === 'lucktext' && /______/.test(x);
  const arLucka = s => /^\d+\. .*______/.test(s) || radlista(s).every(arLuckrad);
  const arSvarsrad = s => radlista(s).every(x => /^\d+: _+$/.test(x));
  // kolumn-krysset: raderna med bokstav, nummer eller punkt (med numrerade rader är bokstavsraderna texter)
  const numrerade = slag === 'kryss' && radlista(elev).some(x => /^\d+\. /.test(x) && !/______/.test(x));
  const radMonster = numrerade ? /^(\d+)\. (.+)$/ : /^([a-z])\) (.+)$/;
  const arRad = x => radMonster.test(x) || /^- (.+)$/.test(x);
  // flervalet: ett stycke med en bokstavsrad ("a) Straffmyndig") och under den alternativen som punkter (2018 A3)
  if (slag === 'kryss' && !numrerade && stycken.some(G.arFlerval)) slag = 'flerval';
  const prompttext = [];                               // uppgiftens text till AI-mallen: elevdelen utan källan
  const delar = [], fler = [];
  let ordbank = null, vantande = { text: [], kolumner: null };
  const raknare = { citat: 0, tabell: 0 }, tabellkryss = [];

  for (let i = 0; i < stycken.length; i++) {
    const s = stycken[i], r = radlista(s), stim = G.lasStimulus(stycken, i, id, raknare);
    if (/^\[Bild: .*\]$/.test(s)) {                    // uppgiftens bild, där den står (eller ingenting)
      if (T.bilder[u.nr]) block.push({ typ: 'uppgift', id: `${id}-bild`, slag: 'bild', bild: T.bilder[u.nr] });
    } else if (/^\*Tips i provet( \([^)]*\))?:\*/.test(s)) {
      const m = s.match(/^\*Tips i provet( \([^)]*\))?:\*\s*/);
      block.push({ typ: 'ruta', rubrik: `Tips i provet${m[1] || ''}:`, text: stil(s.slice(m[0].length)) });
      prompttext.push(ren(s));
    } else if (/^Begrepp: /.test(s)) ordbank = s.replace(/^Begrepp: /, '').split(',').map(x => x.trim());
    else if (arLucka(s)) { /* lucktextens meningar: i övningsblocket */ }
    else if (arSvarsrad(s)) { /* provets svarsrader: svarsrutan ersätter dem */ }
    else if (stim) {                                     // källtext eller tabell: uppgiftens citat eller tabell (lasStimulus)
      block.push(stim.block);
      prompttext.push(stim.prompt);
      i += stim.steg - 1;
    } else if (G.arKryssTabell(s)) {                     // ett kolumn-kryss i en tabell: kolumnerna med ☐, raderna i ordning
      const t = G.tabellrader(s).map(celler), kol = t[0].map((_, k) => t.slice(1).every(x => /^☐$/.test(x[k])));
      const textKol = t[0].map((_, k) => k).filter(k => !kol[k] && !t.slice(1).every(x => /^([a-z]\))?$/.test(x[k])));
      const etikettKol = t[0].findIndex((_, k) => !kol[k] && t.slice(1).every(x => /^[a-z]\)$/.test(x[k])));
      kolla(textKol.length === 1 && kol.filter(Boolean).length >= 2, `uppgift ${u.nr}: oväntad krysstabell`);
      const upg = { typ: 'uppgift', id, slag: 'kryss', kolumner: t[0].filter((_, k) => kol[k]).map(stil),
        rader: t.slice(1).map((x, k) => Object.assign(etikettKol >= 0 ? { etikett: x[etikettKol] } : {}, { text: stil(x[textKol[0]]),
          nyckel: etikettKol >= 0 ? x[etikettKol].replace(/\)$/, '') : String(k + 1) })) };
      block.push(upg);
      tabellkryss.push(upg);
    } else if (slag === 'flerval' && G.arFlerval(s)) {    // en rad i flervalet: begreppet och dess alternativ
      fler.push(G.flervalRad(s));
    } else if (slag === 'kryss' && r.some(arRad)) {      // ett block: text och kolumner före raderna, sedan raderna
      const forst = r.findIndex(arRad), fore = r.slice(0, forst), rader = r.slice(forst);
      kolla(rader.every(arRad), `uppgift ${u.nr}: ett stycke med rader har text efter raderna`);
      const kolrad = fore.find(x => /^Kolumner: /.test(x)), fore0 = delar.reduce((n, d) => n + d.rader.length, 0);
      delar.push({ text: vantande.text.concat(fore.filter(x => !/^Kolumner: /.test(x))),
        kolumner: kolrad ? kolrad.replace(/^Kolumner: /, '').split(' / ').map(x => x.trim()) : vantande.kolumner,
        rader: rader.map((x, k) => { const m = x.match(radMonster); return m ? { etikett: `${m[1]}${numrerade ? '.' : ')'}`, text: stil(m[2]), nyckel: m[1] }
          : { text: stil(x.replace(/^- /, '')), nyckel: String(fore0 + k + 1) }; }) });
      vantande = { text: [], kolumner: null };
    } else if (slag === 'kryss' && r.every(x => /^Kolumner: /.test(x))) vantande.kolumner = r[0].replace(/^Kolumner: /, '').split(' / ').map(x => x.trim());
    else if (slag === 'kryss' && delar.length) vantande.text.push(...r);   // text mellan två block: nästa blocks text
    else if (slag === 'oppen' && r.some(x => /^- /.test(x))) {
      // en lista i en öppen uppgift (som principerna i 2018 A2), ibland i samma stycke som texten före den
      const i = r.findIndex(x => /^- /.test(x)), fore = r.slice(0, i), lista = r.slice(i);
      kolla(lista.every(x => /^- /.test(x)), `uppgift ${u.nr}: text efter en lista i samma stycke`);
      if (fore.length) block.push(fore.length > 1 ? { typ: 'rader', rader: fore.map(stil) } : { typ: 'text', text: stil(fore[0]) });
      block.push({ typ: 'punkter', punkter: lista.map(x => stil(x.replace(/^- /, ''))) });
      prompttext.push(r.map(ren).join('\n'));
    } else {
      block.push(r.length > 1 ? { typ: 'rader', rader: r.map(stil) } : { typ: 'text', text: stil(r[0]) });
      prompttext.push(r.map(ren).join('\n'));
    }
  }

  // NP:s regel om alla kryss i samma kolumn, där NP anger den: i bedömningen eller i uppgiften ("sätter alla som
  // "stämmer" eller "stämmer inte"", 2018 B5)
  const ogiltig = /alla kryss (står )?i samma kolumn/i.test(bedom) || /sätter alla som "stämmer" eller "stämmer inte"/i.test(elev)
    ? { ogiltigSammaKolumn: true } : {};
  if (slag === 'flerval') {
    // Facit: "- a) Straffmyndig: <alternativet>" – svaret är det alternativ som facitraden slutar med (precis ett)
    block.push({ typ: 'uppgift', id, slag: 'flerval', rader: G.flervalRader(u.nr, fler, bedom) });
  } else if (tabellkryss.length) {
    // Kolumn-kryss i tabeller: facit ur en tabell i bedömningen (kolumn n för den n:te tabellen, raderna i ordning) eller
    // ur "- Kolumn: a, b, …"; var sitt kryss med var sin Rätta (id …-1, …-2 när de är flera)
    const ft = tabellrader(bedom).map(celler), fi = bedom.indexOf('**Facit');
    kolla(fi >= 0, `uppgift ${u.nr}: inget facit`);
    const etikettFor = {};
    if (!ft.length && fi >= 0) for (const rad of bedom.slice(fi).split('\n').filter(x => /^- [^:]+: [a-z](, [a-z])*$/.test(x))) {
      const m = rad.match(/^- (.+?): (.+)$/);
      m[2].split(',').map(x => x.trim()).forEach(k => { etikettFor[k] = m[1].trim(); });
    }
    tabellkryss.forEach((upg, j) => {
      if (tabellkryss.length > 1) upg.id = `${id}-${j + 1}`;
      kolla(!ft.length || ft.length - 1 === upg.rader.length, `uppgift ${u.nr}: facittabellen har ${ft.length - 1} rader, tabell ${j + 1} har ${upg.rader.length}`);
      upg.rader.forEach((r, k) => {
        const l = ft.length ? (ft[k + 1] || [])[j + 1] : etikettFor[r.nyckel];
        r.svar = l ? upg.kolumner.findIndex(c => liten(c) === liten(l)) : -1;
        kolla(r.svar >= 0, `uppgift ${u.nr}: tabell ${j + 1}, rad ${r.etikett || k + 1} saknar facit bland kolumnerna ${upg.kolumner.join(' / ')}`);
        delete r.nyckel;
      });
      kolla(upg.kolumner.length >= 2 && upg.kolumner.length <= 3, `uppgift ${u.nr}: ${upg.kolumner.length} kolumner`);
      // (fälten i samma ordning som i de andra kolumn-kryssen: typ, id, slag, kolumner, ogiltigSammaKolumn, rader)
      const rader = upg.rader; delete upg.rader; Object.assign(upg, ogiltig, { rader });
    });
  } else if (slag === 'kryss') {
    kolla(delar.length && !vantande.text.length, `uppgift ${u.nr}: inga rader, eller text efter de sista raderna`);
    const alla = delar.flatMap(d => d.rader);
    // Facit: kolumnens namn för varje rad, ur NP:s bedömning (eller nyckelord, där NP beskriver raderna)
    const etikettFor = {};
    if (T.nycklar[u.nr]) {
      G.facitMedNycklar(u.nr, alla, T.nycklar[u.nr]);
      alla.forEach(r => { etikettFor[r.nyckel] = r.svar === 0 ? 'Ja' : r.svar === 1 ? 'Nej' : null; delete r.svar; });
      const ja = (bedom.match(/^- Ja(?: \([^)]*\))?: (.+)$/m) || [])[1], nej = (bedom.match(/^- Nej: (.+)$/m) || [])[1];
      kolla(ja && ja.split(';').length === T.nycklar[u.nr].Ja.length && nej && nej.split(';').length === T.nycklar[u.nr].Nej.length, `uppgift ${u.nr}: facit och nyckelord har olika antal`);
    } else {
      const fi = bedom.indexOf('**Facit');
      kolla(fi >= 0, `uppgift ${u.nr}: inget facit`);
      for (const rad of bedom.slice(fi).split('\n').slice(1)) {
        if (!rad.trim()) { if (Object.keys(etikettFor).length) break; continue; }
        const num = rad.match(/^(\d+)\. (.+)$/);
        if (num) { const i = num[2].lastIndexOf(': '); etikettFor[num[1]] = num[2].slice(i + 2).trim(); continue; }
        if (!/^- /.test(rad)) break;
        for (const seg of rad.replace(/^- /, '').replace(/^[a-z]\) /, '').split(' · ')) {
          const m = seg.match(/^(.+?): (.+)$/);
          kolla(m, `uppgift ${u.nr}: oväntad facitrad ”${seg}”`);
          if (m) m[2].split(',').map(x => x.trim()).filter(Boolean).forEach(k => { etikettFor[k] = m[1].trim(); });
        }
      }
    }
    for (const d of delar) {
      // kolumnerna: ur "Kolumner: …", annars i den ordning de står i facit
      if (!d.kolumner) {
        const ordning = [...new Set(Object.values(etikettFor))];
        d.kolumner = ordning.filter(l => d.rader.some(r => etikettFor[r.nyckel] === l)).map(versal);
      }
      d.rader.forEach(r => {
        const l = etikettFor[r.nyckel];
        r.svar = l ? d.kolumner.findIndex(k => liten(k) === liten(l)) : -1;
        kolla(r.svar >= 0, `uppgift ${u.nr}: rad ${r.etikett || r.nyckel} saknar facit bland kolumnerna ${d.kolumner.join(' / ')}`);
      });
      kolla(d.kolumner.length >= 2 && d.kolumner.length <= 3, `uppgift ${u.nr}: ${d.kolumner.length} kolumner`);
    }
    const rensa = r => Object.assign(r.etikett ? { etikett: r.etikett } : {}, { text: r.text, svar: r.svar });
    // ett block utan egen text: kolumner och rader direkt i uppgiften
    block.push(delar.length === 1 && !delar[0].text.length
      ? Object.assign({ typ: 'uppgift', id, slag: 'kryss', kolumner: delar[0].kolumner }, ogiltig, { rader: delar[0].rader.map(rensa) })
      : Object.assign({ typ: 'uppgift', id, slag: 'kryss' }, ogiltig, { delar: delar.map(d => Object.assign(d.text.length ? { text: d.text.map(stil) } : {}, { kolumner: d.kolumner, rader: d.rader.map(rensa) })) }));
  } else if (slag === 'lucktext') {
    // En rad med två luckor blir två rader i övningen (ett skrivfält per rad): texten före den andra luckan står på den
    // andra raden, så att meningen står ordagrant läst i ordning
    const luckor = [];
    for (const m of elev.split('\n').filter(x => /^\d+\. .*______/.test(x) || arLuckrad(x)).map(r => r.replace(/^\d+\. /, ''))) {
      const bit = m.split('______');
      for (let k = 0; k < bit.length - 1; k++) luckor.push({ fore: bit[k], efter: k === bit.length - 2 ? bit[k + 1] : '' });
    }
    // Facit: numrerat ("1. asyl") eller meningarna med svaren i fetstil ("- … blir **gripen**.")
    const facit = [];
    let iFacit = false;
    for (const r of bedom.split('\n')) {
      if (/^\*\*Facit:\*\*/.test(r)) { iFacit = true; continue; }
      const m = r.match(/^(\d+)\. (.+)$/);
      if (iFacit && m) facit[+m[1] - 1] = m[2].trim();
      else if (iFacit && /^- .*\*\*/.test(r)) facit.push(...[...r.matchAll(/\*\*(.+?)\*\*/g)].map(x => x[1].trim()));
      else if (iFacit && facit.length && r.trim()) iFacit = false;
    }
    kolla(luckor.length && luckor.length === facit.length, `uppgift ${u.nr}: ${luckor.length} luckor men ${facit.length} facit`);
    kolla(ordbank, `uppgift ${u.nr}: inga begrepp`);
    const former = ord => { kolla(T.bestamd[liten(ord)], `uppgift ${u.nr}: ingen rad i böjningslistan för ”${ord}”`); return [ord, ...(T.bestamd[liten(ord)] || [])]; };
    const utbyt = (T.utbytbara || {})[u.nr] || [];
    const rader = luckor.map((l, k) => {
      kolla(ordbank && ordbank.map(liten).includes(liten(facit[k])), `uppgift ${u.nr}: facit ”${facit[k]}” står inte bland begreppen`);
      const grupp = utbyt.find(g => g.includes(liten(facit[k])));
      if (grupp) kolla(grupp.every(o => facit.map(liten).includes(o)), `uppgift ${u.nr}: utbytbara ${grupp.join('/')} står inte alla i facit`);
      return Object.assign({ fore: stil(l.fore), efter: stil(l.efter), svar: grupp ? [facit[k], ...grupp.filter(o => o !== liten(facit[k]))].flatMap(former) : former(facit[k]) },
        grupp ? { olika: grupp.join('/') } : {});
    });
    block.push({ typ: 'uppgift', id, slag: 'lucktext', ordbank, rader });
  } else {
    // Öppen: A-kriteriet är den tredje cellen i NP:s matris (| E | C | A |)
    const matris = tabellrader(bedom);
    kolla(matris.length === 2 && celler(matris[0])[2] === 'A', `uppgift ${u.nr}: hittar inte nivåmatrisen`);
    const kriterium = matris.length === 2 ? ren(celler(matris[1])[2]) : '';
    // skrivmodellen efter NP:s typ: en resonerande uppgift får Redogöra och Resonera, en beskrivande Redogöra
    block.push(G.oppenUppgift(id, u.nr, prompttext.join('\n\n'), kriterium, /resonerande/.test(typ) ? modell.slice(0, 2) : modell.slice(0, 1)));
  }
  // Uppslaget (väg 3): lucktexten och kryssuppgifterna börjar på en vänstersida (begreppen och raderna till vänster)
  avsnitt.push(Object.assign({ id: `uppgift-${u.nr}`, titel: u.titel }, slag === 'oppen' ? {} : { till: 'vanster' }, { block }));
}

const bok = G.skrivBok(UT, `/* GENERERAD av verktyg/md-till-np.js ur Joachims samlade material (Del A och Del C) – skriv inte i den här filen
 * för hand. Nationella prov-boken till temat: uppgifterna ordagrant ur nationella proven 2016–2018, som motorns övningar
 * ({typ: 'uppgift'}, bokskal/README.md). Facit står här (rättningen sker i webbläsaren) men ritas aldrig. A-exemplen
 * står inte här. */`, avsnitt);
// A-exemplen (NP:s elevsvar, och i det samlade materialet också Del B:s): ingen rad ur något av dem får stå i boken
const aExempel = [...delA.matchAll(/\*\*A-exempel[^\n]*\n([\s\S]*?)\n\n\*\*Bedömningskommentar/g)].map(m => m[1])
  .concat(samlat ? [...G.delAv(md, '\n# Del B', '\n# Del C').matchAll(/\*\*A-exempel[^\n]*\n([\s\S]*?)\n\n\*Kommentar/g)].map(m => m[1]) : []);
G.aExempelSparr(aExempel, bok.json, T.aExempel);
// (och inget annat som citeras i bedömningen, som exempelsvaren i 2016 B9)
G.citatSparr(uppgifter.map(u => u.kropp.split('\n### Bedömningsanvisning (NP)\n')[1] || ''), bok.json);
G.stoppaVidFel();
bok.skriv();
console.log(`${path.relative(ROT, UT)}: ${avsnitt.length} uppgifter`);
