/* FÄRGPROV – inte elevinnehåll. En sida i bokformat för att välja samhällets accent (se fargprov.js).
 * Två texter i Standard, med de block som bär accenten: rubriker, begrepp, faktarutan, tabellen och länken. */
Bok.delkapitel({
  id: 'sam-fargprov',
  amne: 'Samhällskunskap',
  smulor: [{ text: 'Samhällskunskap' }, { text: 'Inför slutprovet' }],
  nummer: 1,
  titel: 'Färgprov',
  undertitel: 'plommon som samhällets accent',
  overrad: 'Samhällskunskap · Färgprov',
  upphov: { namn: 'Joachim Björkman', ar: 2026 },
  texter: [
    { id: 'prov-a', titel: 'Provtext A' },
    { id: 'prov-b', titel: 'Provtext B' }
  ],
  djupdykningar: [
    { id: 'prov', titel: 'Ett kort i Vill du veta mer?', fil: 'innehall/djupdykningar/prov.js' }
  ],
  hjalpmedel: {
    forelasning:    { href: null },
    ova:            { href: null },
    sjalvskattning: { href: null },
    begreppslista:  { href: null },
    elevbok:        { href: null }
  }
});
