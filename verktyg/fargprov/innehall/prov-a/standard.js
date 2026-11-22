/* FÄRGPROV – inte elevinnehåll. Provtext som visar accenten i boken. */
Bok.niva('standard', {
  avsnitt: [
    { id: 'inledning', titel: 'Inledning', numrerad: false, block: [
      { typ: 'text', text: 'Provtext. Den här boken finns bara för att visa samhällets accentfärg på papperet. Byt nyans med väljaren uppe till höger eller med tangenterna 1, 2 och 3.' }
    ] },
    { id: 'forsta', titel: 'Accenten i texten', block: [
      { typ: 'rubrik', text: 'Begrepp står i accentfärgen' },
      { typ: 'text', text: 'Provtext med ett *begrepp* och ett *provbegrepp* i löptexten. Resten av stycket är vanligt bläck på papper, så att det syns hur accenten står mot brödtexten i en hel rad.' },
      { typ: 'ruta', rubrik: 'Faktaruta', text: 'Rutans botten är papper-ljus med en svag ton av accenten, och vänsterkanten är accenten.' },
      { typ: 'underrubrik', text: 'En underrubrik' },
      { typ: 'text', text: 'Provtext. Ännu ett stycke för att se rubrikerna, sidhuvudet och sidnumret i sitt sammanhang.' }
    ] },
    { id: 'andra', titel: 'Accenten i tabeller och rutor', block: [
      { typ: 'rubrik', text: 'Tabellhuvudet och definitionsrutan' },
      { typ: 'tabell', rubriker: ['Nyans', 'Färg', 'Kontrast'], rader: [['A', '#7d4a6c', '5,3:1'], ['B', '#6e3d5e', '6,5:1'], ['C', '#5b2f4e', '8,3:1']] },
      { typ: 'ruta', stil: 'definition', rubrik: 'Definitionsruta', text: 'En större ruta för en definition, i samma ton.' },
      { typ: 'jamforelse', kolumner: [{ rubrik: 'Vänster', punkter: ['Provpunkt.', 'Provpunkt.'] }, { rubrik: 'Höger', punkter: ['Provpunkt.', 'Provpunkt.'] }] },
      { typ: 'lank', till: ['ova', 'sjalvskattning'] }
    ] },
    { id: 'sammanfattning', titel: 'Sammanfattning', numrerad: false, block: [
      { typ: 'punkter', punkter: ['Provpunkt om accenten.', 'Provpunkt om papperet.'] },
      { typ: 'lank', till: ['ova', 'sjalvskattning'] }
    ] }
  ]
});
