// md-till-repetitionsbok.js – för in temats sammanfattning (kallor/<tema>.md) i temasidans repetitionsbok
// (infor-slutprovet/<tema>/innehall/repetition.js). Som Fysiks verktyg/kap3-omvandlare.js: källan är texten, och
// bokens fil skrivs av verktyget. Ändra alltså källan och kör verktyget igen – skriv inte i repetition.js.
//
//   node verktyg/md-till-repetitionsbok.js            alla teman som har en källa
//   node verktyg/md-till-repetitionsbok.js media      bara det temat
//
// Så förs källan in (ordagrant, bara formen ändras):
//   # rubrik         bokens titel – står i delkapitel.js, inte i boken
//   ## rubrik        ett avsnitt utan nummer (textstilen: inga numrerade rubriker). Rubriken står i innehållsförteckningen
//                    och i sidhuvudet, och – om avsnittet inte har egna ###-rubriker – också först i texten.
//   ### rubrik       en rubrik i texten (styrelseskick: frågorna i Joachims frågeplan)
//   stycke           ett textblock
//   - punkt          en punktlista;  1. punkt  en numrerad lista
//   **ord**          ett nyckelbegrepp: *ord* i boken (fetstil i accentfärgen, motorns enda markering)
//   *ord*            kursiv finns inte i motorn: orden står som vanlig text
// Text före det första ## står först i det första avsnittet.
'use strict';
const fs = require('fs'), path = require('path');
const ROT = path.resolve(__dirname, '..');

const TEMAN = ['individ-migration-minoriteter', 'styrelseskick', 'lag-och-ratt', 'beslutsfattande', 'media',
  'samhalls-och-privatekonomi'];

const slugg = s => s.toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/é/g, 'e')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// Kursiv (*ord*) blir vanlig text, fetstil (**ord**) blir motorns begrepp (*ord*)
const inline = s => s.replace(/(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/g, '$1').replace(/\*\*([^*]+?)\*\*/g, '*$1*');
const q = s => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";

function omvandla(md) {
  const rader = md.replace(/\r\n/g, '\n').split('\n');
  const avsnitt = [], fore = [];
  let akt = null, stycke = [], lista = null;
  const block = () => (akt ? akt.block : fore);
  const slutStycke = () => { if (stycke.length) block().push({ typ: 'text', text: inline(stycke.join(' ')) }); stycke = []; };
  const slutLista = () => { if (lista) block().push(lista); lista = null; };
  const slut = () => { slutStycke(); slutLista(); };
  for (const r of rader) {
    const t = r.trim();
    let m;
    if (!t) { slut(); continue; }
    if (/^# /.test(t)) { slut(); continue; }
    if ((m = t.match(/^## (.+)$/))) {
      slut();
      akt = { titel: m[1].trim(), block: [], egnaRubriker: false };
      if (!avsnitt.length) akt.block.push(...fore.splice(0));
      avsnitt.push(akt);
      continue;
    }
    if ((m = t.match(/^### (.+)$/))) { slut(); akt.egnaRubriker = true; block().push({ typ: 'rubrik', text: m[1].trim() }); continue; }
    if ((m = t.match(/^- (.+)$/)) || (m = t.match(/^\d+\. (.+)$/))) {
      slutStycke();
      const typ = /^- /.test(t) ? 'punkter' : 'numrerad';
      if (lista && lista.typ !== typ) slutLista();
      if (!lista) lista = { typ, punkter: [] };
      lista.punkter.push(inline(m[1].trim()));
      continue;
    }
    slutLista();
    stycke.push(t);
  }
  slut();
  const ids = new Set();
  return avsnitt.map(a => {
    let id = slugg(a.titel).split('-').slice(0, 6).join('-'), n = 2;
    while (ids.has(id)) id = slugg(a.titel) + '-' + n++;
    ids.add(id);
    const b = a.egnaRubriker ? a.block : [{ typ: 'rubrik', text: a.titel }, ...a.block];
    return { id, titel: a.titel, block: b };
  });
}

function skriv(avsnitt, kalla) {
  const blockText = b => b.typ === 'punkter' || b.typ === 'numrerad'
    ? `{ typ: '${b.typ}', punkter: [\n${b.punkter.map(p => '          ' + q(p)).join(',\n')}\n        ] }`
    : `{ typ: '${b.typ}', text: ${q(b.text)} }`;
  return `/* Repetitionsbok – skriven av verktyg/md-till-repetitionsbok.js ur ${kalla}. Ändra inte här: ändra källan och
 * kör verktyget. Källan är Joachims text, ordagrant, i textstilen (CLAUDE.md, Textstil); originalet ligger i
 * kallor/original/. */
Bok.niva('repetitionsbok', {
  avsnitt: [
${avsnitt.map(a => `    {
      id: ${q(a.id)}, titel: ${q(a.titel)}, numrerad: false,
      block: [
${a.block.map(b => '        ' + blockText(b)).join(',\n')}
      ]
    }`).join(',\n')}
  ]
});
`;
}

const bara = process.argv[2];
for (const tema of TEMAN) {
  if (bara && tema !== bara) continue;
  const kalla = path.join(ROT, 'kallor', tema + '.md');
  if (!fs.existsSync(kalla)) { console.log(`${tema}: ingen källa (kallor/${tema}.md) – boken lämnas som den är`); continue; }
  const avsnitt = omvandla(fs.readFileSync(kalla, 'utf8'));
  const ut = path.join(ROT, 'infor-slutprovet', tema, 'innehall', 'repetition.js');
  fs.writeFileSync(ut, skriv(avsnitt, 'kallor/' + tema + '.md'));
  const ord = avsnitt.flatMap(a => a.block.flatMap(b => b.punkter || [b.text])).join(' ').split(/\s+/).filter(Boolean).length;
  console.log(`${tema}: ${avsnitt.length} avsnitt, ${ord} ord → ${path.relative(ROT, ut)}`);
}
