/* Inför slutprovet, tema 6: Samhälls- och privatekonomi. En repetitionsbok utan nivåer (repetitionsbocker, Fysiks motor sedan
 * 2026-11-22). Sidan har bara boken: inga texter, nivåer eller flikar (nivaer: [], flikar: false). Boken är tom och
 * visas som "kommer" tills sammanfattningen finns i innehall/repetition.js. Bara data; motorn är bokskal/.
 * Fälten beskrivs i bokskal/README.md (Fristående böcker). ELEVTEXT: titel och undertitel sätter Joachim. */
Bok.delkapitel({
  id: 'sam-infor-slutprovet-samhalls-och-privatekonomi',   // nyckeln för det eleven sparat – byt det aldrig
  amne: 'Samhällskunskap',
  smulor: [{ text: 'Samhällskunskap', href: '../../index.html' },
           { text: 'Inför slutprovet', href: '../index.html' }],
  nummer: 6,
  titel: 'Samhälls- och privatekonomi',
  undertitel: null,
  overrad: 'Samhällskunskap · Inför slutprovet',
  upphov: { namn: 'Joachim Björkman', ar: 2026 },
  nivaer: [],
  flikar: false,

  // Temats repetitionsbok. id är nyckeln för det eleven sparat – byt det aldrig. Adressen: index.html#repetition-samhalls-och-privatekonomi
  repetitionsbocker: [
    { id: 'samhalls-och-privatekonomi', titel: 'Samhälls- och privatekonomi', fil: 'innehall/repetition.js' }
  ],

  // NP-liknande frågor per tema (senare fas, inte byggd): plats här på temasidan.
  hjalpmedel: {}
});
