/* Inför slutprovet, tema 1: Individ, migration och minoriteter. En repetitionsbok utan nivåer (repetitionsbocker, Fysiks motor sedan
 * 2026-11-22). Sidan har bara boken: inga texter, nivåer eller flikar (nivaer: [], flikar: false). Boken är tom och
 * visas som "kommer" tills sammanfattningen finns i innehall/repetition.js. Bara data; motorn är bokskal/.
 * Fälten beskrivs i bokskal/README.md (Fristående böcker). ELEVTEXT: titel och undertitel sätter Joachim. */
Bok.delkapitel({
  id: 'sam-infor-slutprovet-individ-migration-minoriteter',   // nyckeln för det eleven sparat – byt det aldrig
  amne: 'Samhällskunskap',
  smulor: [{ text: 'Samhällskunskap', href: '../../index.html' },
           { text: 'Inför slutprovet', href: '../index.html' }],
  nummer: 1,
  titel: 'Individ, migration och minoriteter',
  undertitel: null,
  overrad: 'Samhällskunskap · Inför slutprovet',
  upphov: { namn: 'Joachim Björkman', ar: 2026 },
  nivaer: [],
  flikar: false,

  // Temats repetitionsbok. id är nyckeln för det eleven sparat – byt det aldrig. Adressen: index.html#repetition-individ-migration-minoriteter
  repetitionsbocker: [
    { id: 'individ-migration-minoriteter', titel: 'Individ, migration och minoriteter', fil: 'innehall/repetition.js' },
    // Övningsboken (Joachims beslut 2026-11-23: en egen bok bredvid repetitionsboken): NP-liknande uppgifter, motorns
    // övningar ({typ: 'uppgift'}). Skrivs av verktyg/md-till-uppgifter.js. Adressen: index.html#repetition-ova-individ-migration-minoriteter
    { id: 'ova-individ-migration-minoriteter', titel: 'Öva inför slutprovet: Individ, migration och minoriteter', fil: 'innehall/ovningar.js' }
  ],

  hjalpmedel: {}
});
