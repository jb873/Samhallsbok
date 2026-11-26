/* Inför slutprovet, tema 4: Beslutsfattande. En repetitionsbok utan nivåer (repetitionsbocker, Fysiks motor sedan
 * 2026-11-22). Sidan har bara boken: inga texter, nivåer eller flikar (nivaer: [], flikar: false). Boken (Läsa) är byggd
 * 2026-11-24 ur kallor/beslutsfattande.md (verktyg/md-till-repetitionsbok.js), Nationella prov-boken 2026-11-26; ingen
 * Öva-bok än. Bara data; motorn är bokskal/.
 * Fälten beskrivs i bokskal/README.md (Fristående böcker). ELEVTEXT: titel och undertitel sätter Joachim. */
Bok.delkapitel({
  id: 'sam-infor-slutprovet-beslutsfattande',   // nyckeln för det eleven sparat – byt det aldrig
  amne: 'Samhällskunskap',
  smulor: [{ text: 'Samhällskunskap', href: '../../index.html' },
           { text: 'Inför slutprovet', href: '../index.html' }],
  nummer: 4,
  titel: 'Beslutsfattande',
  undertitel: 'Sveriges och EU:s styrelseskick',
  overrad: 'Samhällskunskap · Inför slutprovet',
  upphov: { namn: 'Joachim Björkman', ar: 2026 },
  nivaer: [],
  flikar: false,

  // Temasidan är ingången (Joachim 2026-11-24): överst väljer eleven Läsa (repetitionsboken, titeln "Läsa: …") eller Öva
  // (övningsboken, "Öva: …", där den finns). Korten är motorns kort för fristående böcker; titeln är kortets text.
  // Temats repetitionsbok. id är nyckeln för det eleven sparat – byt det aldrig. Adressen: index.html#repetition-beslutsfattande
  repetitionsbocker: [
    { id: 'beslutsfattande', titel: 'Läsa: Beslutsfattande', fil: 'innehall/repetition.js' },
    // Nationella prov-boken (arbetsorder 2026-11-26): de tio NP-uppgifterna (verktyg/md-till-np.js). id:t är nyckeln för
    // det eleven sparat – byt det aldrig. Adressen: #repetition-np-beslutsfattande. Öva-boken är inte byggd.
    { id: 'np-beslutsfattande', titel: 'Nationella prov: Beslutsfattande', fil: 'innehall/nationella-prov.js' }
  ],

  hjalpmedel: {}
});
