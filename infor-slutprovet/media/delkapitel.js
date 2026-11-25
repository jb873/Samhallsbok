/* Inför slutprovet, tema 5: Media. En repetitionsbok utan nivåer (repetitionsbocker, Fysiks motor sedan
 * 2026-11-22). Sidan har bara boken: inga texter, nivåer eller flikar (nivaer: [], flikar: false). Boken är tom och
 * visas som "kommer" tills sammanfattningen finns i innehall/repetition.js. Bara data; motorn är bokskal/.
 * Fälten beskrivs i bokskal/README.md (Fristående böcker). ELEVTEXT: titel och undertitel sätter Joachim. */
Bok.delkapitel({
  id: 'sam-infor-slutprovet-media',   // nyckeln för det eleven sparat – byt det aldrig
  amne: 'Samhällskunskap',
  smulor: [{ text: 'Samhällskunskap', href: '../../index.html' },
           { text: 'Inför slutprovet', href: '../index.html' }],
  nummer: 5,
  titel: 'Media',
  undertitel: null,
  overrad: 'Samhällskunskap · Inför slutprovet',
  upphov: { namn: 'Joachim Björkman', ar: 2026 },
  nivaer: [],
  flikar: false,

  // Temasidan är ingången (Joachim 2026-11-24): överst väljer eleven Läsa (repetitionsboken, titeln "Läsa: …") eller Öva
  // (övningsboken, "Öva: …", där den finns). Korten är motorns kort för fristående böcker; titeln är kortets text.
  // Temats repetitionsbok. id är nyckeln för det eleven sparat – byt det aldrig. Adressen: index.html#repetition-media
  repetitionsbocker: [
    { id: 'media', titel: 'Läsa: Media', fil: 'innehall/repetition.js' },
    // Övningsboken och Nationella prov-boken (arbetsorder 2026-11-25), som på tema I–III: de sex egna NP-liknande
    // uppgifterna (verktyg/md-till-uppgifter.js) och de fjorton NP-uppgifterna (verktyg/md-till-np.js). id:n är nycklarna
    // för det eleven sparat – byt dem aldrig. Adresserna: #repetition-ova-media och #repetition-np-media
    { id: 'ova-media', titel: 'Öva: Media', fil: 'innehall/ovningar.js' },
    { id: 'np-media', titel: 'Nationella prov: Media', fil: 'innehall/nationella-prov.js' }
  ],

  // NP-liknande frågor per tema (senare fas, inte byggd): plats här på temasidan.
  hjalpmedel: {}
});
