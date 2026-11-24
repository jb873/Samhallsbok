/* Inför slutprovet, tema 3: Lag och rätt. En repetitionsbok utan nivåer (repetitionsbocker, Fysiks motor sedan
 * 2026-11-22). Sidan har bara boken: inga texter, nivåer eller flikar (nivaer: [], flikar: false). Boken är tom och
 * visas som "kommer" tills sammanfattningen finns i innehall/repetition.js. Bara data; motorn är bokskal/.
 * Fälten beskrivs i bokskal/README.md (Fristående böcker). ELEVTEXT: titel och undertitel sätter Joachim. */
Bok.delkapitel({
  id: 'sam-infor-slutprovet-lag-och-ratt',   // nyckeln för det eleven sparat – byt det aldrig
  amne: 'Samhällskunskap',
  smulor: [{ text: 'Samhällskunskap', href: '../../index.html' },
           { text: 'Inför slutprovet', href: '../index.html' }],
  nummer: 3,
  titel: 'Lag och rätt',
  undertitel: null,
  overrad: 'Samhällskunskap · Inför slutprovet',
  upphov: { namn: 'Joachim Björkman', ar: 2026 },
  nivaer: [],
  flikar: false,

  // Temasidan är ingången (Joachim 2026-11-24): överst väljer eleven Läsa (repetitionsboken, titeln "Läsa: …") eller Öva
  // (övningsboken, "Öva: …", där den finns). Korten är motorns kort för fristående böcker; titeln är kortets text.
  // Temats repetitionsbok. id är nyckeln för det eleven sparat – byt det aldrig. Adressen: index.html#repetition-lag-och-ratt
  repetitionsbocker: [
    { id: 'lag-och-ratt', titel: 'Läsa: Lag och rätt', fil: 'innehall/repetition.js' }
  ],

  // NP-liknande frågor per tema (senare fas, inte byggd): plats här på temasidan.
  hjalpmedel: {}
});
