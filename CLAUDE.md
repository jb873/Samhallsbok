# CLAUDE.md — Samhällsboken

> Designstandard och arbetsregler för Code när Code arbetar i
> Samhällsboken-repot. Läs varje gång du startar en ny session.

**Senast uppdaterad:** 2026-11-22
**Plattformsversion:** Alphaskolans lärplattform v0.3 (Lager 1) + Lager 2-3-utökning v0.1
**Bok-status:** 2026-11-24: motorn är Fysikbok 5a53cf6, med repetitionsboken, övningarna (blocktypen `uppgift`, med uppgiftens bild), och vänster- och högersidor (efterpasset, väg 3). Alla fem temana med text (I–V) har en Öva-bok och en Nationella prov-bok bredvid repetitionsboken (III och V sedan 2026-11-25, IV sedan 2026-11-26). Fem av sex repetitionsböcker i *Inför slutprovet* är byggda: I Individ, migration och minoriteter, II Styrelseskick, III Lag och rätt och V Media (nattordern 2026-11-22), och IV Beslutsfattande (2026-11-24, Joachims text oförändrad, inklusive "Det här har ändrats sedan boken skrevs"). VI Samhälls- och privatekonomi saknar text och står som "kommer". Se *Obeslutat* nedan.

---

## Regel 0 — inga beslut utan Joachims godkännande

Reglerna i det här repot är kontraktet. Varje chatt och varje Code-pass som rör boken läser dem **FÖRST** och bygger på det som redan står här.

- Finns en konvention: följ den exakt och bygg på **funktionen** där den bor — kopiera aldrig in en parallell variant.
- Saknas en regel för det som behövs: **stanna, lägg fram alternativ, fråga Joachim.** Gissa aldrig, "kör inte bara på".
- Inget nytt designval, ny komponent eller ny regel införs utan Joachims godkännande. En ny plattformsobservation skrivs i [`PLATTFORMS-ANDRINGAR.md`](PLATTFORMS-ANDRINGAR.md) tills den är beslutad.

**Vad vaktar den:** — (ingen grind; bärs av att den står först och att varje pass läser den.)

---

## Vad detta repo är

Samhällsboken är en **läsebok** i Alphaskolans lärplattform, i geografi/historia-familjen. Den är **inte** matematikmotorn: ingen moment/öva/prov-struktur.

- **Innehållsramen** är Historiabokens (`jb873/Historiabok`, den här filen bygger på dess CLAUDE.md).
- **Referensimplementationen** att kopiera komponenter rakt av från är Geografibokens (`jb873/Geografibok`).
- **Bokformatet** (bläddringsbara böcker) är bokmotorn i [`bokskal/`](bokskal/). **Fysiks motor är standarden** (Joachims beslut 2026-11-22), kopierad ordagrant från Fysikbok 5a53cf6 (2026-11-25, med repetitionsboken, övningarna med kolumn-krysset, uppgiftens bild och citat, efterpasset och de öppna uppgifternas uppslag) — inte Geografis äldre kopia. Motorns handbok är Fysiks README, här [`bokskal/README.md`](bokskal/README.md).
- **Enkällig motor:** motorn ändras aldrig här. Ändringar görs i Fysikbok och kopieras hit byte för byte (se `PLATTFORMS-ANDRINGAR.md`).
  **Undantag (Joachim, 2026-11-25):** flervalet (`slag: 'flerval'`, med delningsregeln `upgMinst`) lucktextens `olika` (luckor i valfri ordning, inte samma begrepp två gånger) Medias källtexter och tabeller (se *Media-stimulus* nedan) och tema IV:s tre uppgiftstyper (urvalet, matchningen och kolumn-kryss med fler än tre kolumner, se nedan) är byggda i Samhälles kopia, eftersom fysiksessionen äger Fysik-mappen tills order 38 är klar. Till dess avviker `bokskal/bok.js`, `bok.css` och `README.md` från Fysikbok 5a53cf6; det infälls i Fysiks motor senare och kopieras sedan hit som vanligt.

---

## Plattformen — vad är låst

### Fonter (LÅST på plattformsnivå)
- **Display/rubriker:** Marcellus SC
- **Brödtext:** EB Garamond
- Får ALDRIG ändras. Plattformsregeln är att eleven ska känna igen Alphaskolan omedelbart oavsett ämne.

### Bas-palett (LÅST)
- `--paper: #ece2c8`
- `--paper-light: #f4ecd6`
- `--ink: #1b2a36`
- `--brass: #b8902a` (motsvarar plattformens `--as-gold`)
- `--blood: #6e2e1e`
- `--terra: #b06a3a`
- `--land: #5e7a3e`
- `--ocean: #1e5c7a`
- `--muted: #6b5e4c`
- `--ink-blue: #4a6a85`

### Komponenter (LÅSTA mönster — kopiera från Geografi)
Följande komponenter implementeras enligt Geografibokens kanoniska mönster:
- `.flikar-rad` med fyra flikar: **Föreläsning**, **Läs** (default), **Öva**, **Elevboken**
- `.bildguide` (brass-kant, 👁), `.karnpunkter` (terra-kant, 🎯), `.fordj-kort`, `.kort-grid`
- `.niva-valjare` med tre nivåer: 📗 Enkel / 📘 Standard (default) / 📕 Fördjupning
- `.underdel-valjare` (A/B/C/D inom Läs-fliken)
- `.begrepp-kort` med dynamisk upplåsning (8 ord, inga nyckelord)
- Elevbok med ramar i webben + print-CSS (16px webb, 11px print)
- Självskattning med fyra alternativ (Kan/Osäker/Kan ej/Ej bedömt), grupperade begreppsmoment, expandbara förtydliganden
- Export/Import via `elevdata-overforing.js`
- `.brodsmulor`, `.kapitel-kort`, `.resurs-kort`

**Bokformatet:** delkapitelsidan och böckerna byggs av `bokskal/` — en sida är en mapp med `index.html` (mallen ordagrant) och `delkapitel.js` (bara data). Se `bokskal/README.md`. Motorn är fryst; ändringar i den är motorarbete och kräver Joachims godkännande.

---

## Samhällskunskap-specifikt

### Beslutat (Joachim, 2026-11-22)
- **Motorn:** Fysiks (se ovan).
- **Repetitionsböckerna:** en nivålös bok av en femte sort fristående bok, *repetitionsbok* (`repetitionsbocker` i `delkapitel.js`, adress `#repetition-<id>`, omslagets överrad "Repetition", kortet först i Läs utan rubrik). Sorten bor i Fysiks motor (Fysikbok 3c3cc86) och är kopierad hit.
- **Mappform:** Fysiks, två mappar djupt: `infor-slutprovet/index.html` (kapitelindex) och `infor-slutprovet/<tema>/` (en sida per tema, mallen ordagrant).
- **Prefix:** `sam`. Varje `id` i `delkapitel.js` börjar med `sam-`.
- **Omslag:** inget nu (ingen `kapitel`-rad, inget motiv).
- **Etiketter:** "Kommer snart" där texten är fri (startsidan, kapitelindex); motorns egen "kommer" på en tom bok lämnas som den är.
- **Signaturfärg:** plommon/aubergine, samhällets enda ämnesegna färg; allt annat formspråk är plattformens delade (papper, bläck, typsnitt, mässing). Den bor i [`css/bok-samhalle.css`](css/bok-samhalle.css), som laddas efter motorn (Geografis mönster med `bok-geografi.css`).
  **Nyansen är C, djup aubergine `#5b2f4e`** (8,3:1 mot papperet), vald på ögat i färgprovet [`verktyg/fargprov/index.html`](verktyg/fargprov/index.html) (A `#7d4a6c`, B `#6e3d5e`, C `#5b2f4e`).
- **Grinden:** kontrolläget (`?kontroll`) körs per sida. Delningen av grinden (en motordel som följer med motorn och en del per bok) är ett eget spår, inte här.
- **Övningarna (Joachim, 2026-11-23):** NP-liknande uppgifter per tema i en egen bok bredvid repetitionsboken på temasidan (`repetitionsbocker`, adress `#repetition-ova-<tema>`), byggda med motorns delade övningskomponent, blocktypen `uppgift` (se `bokskal/README.md`, *Övningar*; i motorn sedan Fysikbok 6297bbf). Bara tre slutna typer: lucktext, Ja/Nej och stämmer/stämmer inte. Efter Rätta: ✓/✗ per rad och antal rätt, utan facit och utan E/C/A. Lucktexten: eleven skriver, generöst rättat (stora och små bokstäver, bestämd form). De öppna: uppgiften, skrivmodellen (Redogöra, och Resonera för resonera-uppgifter; inte bedömnings- och nivådelarna), en svarsruta och en knapp som kopierar AI-mallen med svaret ifyllt.
- **Temasidan är ingången (Joachim, 2026-11-24):** "Temasidan är ingången. Startsidans kort leder till temasidan. Överst på temasidan väljer eleven Läsa (repetitionsboken) eller Öva (övningsboken, där den finns)."
  - Så är det byggt, utan något nytt i motorn: startsidans och kapitelindexets kort går till `<tema>/index.html`. Överst på temasidan står motorns kort för fristående böcker; repetitionsboken heter "Läsa: <tema>" och övningsboken "Öva: <tema>", och kortet visar titeln.
  - Senare (inte nu): Läsa och Öva som lägen i samma bok, en växel inne i boken. Det är en medveten ändring i motorn som beställs för sig.
- **Uppslaget i övningsboken (Joachim, 2026-11-24, väg 3):** motorns efterpass styr vänster- och högersidor (`till`, se `bokskal/README.md`, *Vänster- och högersidor*). Kryssuppgifterna (tvåval) börjar på en vänstersida; i de öppna står skrivmodellen till vänster och svarsrutan överst till höger. Där en sida annars hamnar fel står en utfyllnadssida "Fortsätter på nästa sida", och samma rad står längst ned på en högersida där uppgiften fortsätter. Eleven ska aldrig tro att uppgifterna tagit slut. Gränsen: en bok med `till` får inte ha figurer eller formler.
  - **De öppnas uppslag (Joachim, 2026-11-25, ersätter samma dags kompakta regel):** uppslag 1: uppgiftstexten på vänstersidan och skrivmodellen på högersidan; uppslag 2: svarsrutan. Texten börjar på en vänstersida, modellen flödar direkt efter – aldrig en tom sida mellan text och modell – och svarsrutan börjar på ny sida. Efter svarsrutan kan en utfyllnadssida bli kvar ("blir det en sida till gör det inget"). Motorn: `till: 'uppslag'` i den öppna uppgiften (Fysikbok 5a53cf6). Tema II NP 8 har en text som är längre än en sida: där står modellen till vänster och svarsrutan till höger på uppslaget efter texten.
  - Inte nu: lucktexten helt på ett uppslag (a). Väljs när det mätts om ett smalare fält räcker.
- **Nationella prov-boken (Joachim, 2026-11-24):** de sju riktiga NP-uppgifterna (Del A ur det samlade materialet, ordagrant med NP:s facit) i en egen interaktiv bok, skild från Öva-boken, som ett tredje kort på temasidan (tema I). Samma övningskomponent, inga nya typer, inget nytt i motorn; samma uppslag (väg 3). De slutna rättas mot NP:s facit (gränserna E/C/A används inte: eleven ser antal rätt, aldrig nivå). De öppna: skrivmodellen, A-kriteriet ur NP:s matris och samma AI-mall som Öva-boken. **NP:s A-exempel publiceras aldrig** (prompt, källkod eller historik); verktyget stoppar om en rad ur något A-exempel skulle stå i boken. Uppgift 6–7 (befolkning, gränsar mot geografi) är med tills Joachim säger annat. Bilderna i Del A: en uppgifts bild står i uppgiften som **`uppgiftsbild`** (`slag: 'bild'`, se nedan), bara när Joachim godkänt bilden. Uppgift 3: ingen bild (© UNHCR, publiceras inte). Uppgift 6: väntar på en karta som visar befolkningsfördelningen (bilden i NP-PDF:en är bara Sveriges kontur).
  - Bekräftat av Joachim 2026-11-24: etiketten **"Nationella prov"** och böjningslistan i lucktexten (`BESTAMD` i `verktyg/md-till-np.js`: asylen, flyktingen, visumet, migrationen, integrationen, segregationen, emigrationen; Migrationsverket bara som det står). Listan är låst.
- **Kolumn-kryss (Joachim, 2026-11-24, godkänt):** den enda självrättande kryss-typen i den delade övningskomponenten (`slag: 'kryss'`): 2–3 kolumner och raderna som data, och en uppgift kan ha flera block med egna kolumner och en egen text före raderna (`delar`). Täcker Ja/Nej, Stämmer/Stämmer inte, Stödjer/Stödjer inte, demokrati/diktatur/varken, monarki/republik, direkt/representativ. NP:s regel "alla kryss i samma kolumn = ogiltigt" behålls per uppgift där NP anger den; ett kryss per rad, så "två kryss" uppstår inte. Rätta: ✓/✗ per rad och antal rätt, utan facit och utan E/C/A. Ja/Nej och stämmer i tema I är flyttade hit (tvåvalet finns inte längre). En citerad ingång i en uppgift är `slag: 'citat'` (uppgift-internt, som bilden). Motorn: Fysikbok 8aecb03. Undantag sedan 2026-11-25: NP:s "kryssa för den förklaring som passar bäst" (fyra alternativ per begrepp) är flervalet, `slag: 'flerval'`, en egen typ (se *Tema III*).
- **Tema II Styrelseskick (Joachim, 2026-11-24):** Läsa, Öva och Nationella prov på temasidan, som tema I. Öva: Joachims sex NP-liknande (`NP-liknande_Styrelseskick_v2.md`, `verktyg/md-till-uppgifter.js`); Nationella prov: de åtta NP-uppgifterna med NP:s facit (`NP_styrelseskick_med_bedomning_v2.md`, `verktyg/md-till-np.js`). Samma skrivmodell och AI-mall. Inga A-exempel i böckerna.
- **Tema III Lag och rätt (arbetsorder 2026-11-25):** Läsa, Öva och Nationella prov på temasidan, som tema I och II. Öva: Joachims sex NP-liknande (`NP-liknande_Lag_och_ratt.md`); Nationella prov: NP-uppgifterna med NP:s facit (`NP_lag_och_ratt_med_bedomning.md`), Samma verktyg, skrivmodell och AI-mall. Inga A-exempel i böckerna. NP 1 (2017 B4) har två rader med två luckor: varje lucka blir en rad i lucktexten (ett skrivfält per rad), så att orden står ordagrant i ordning. NP 3 (2018 B5): NP:s regel om alla kryss i samma kolumn står i uppgiften och gäller. NP 2 (2018 A3 Juridiska begrepp) är flerval (`slag: 'flerval'`, Joachims beslut 2026-11-25): ett kryss per begrepp bland dess fyra alternativ, rättat mot NP:s facit; NP-boken har uppgift 1–5.
  - **Bekräftat av Joachim 2026-11-25:** böjningslistorna i Öva 2 (`TEMAN['lag-och-ratt'].bestamd` i `verktyg/md-till-uppgifter.js`) och NP 1 (samma i `verktyg/md-till-np.js`) är låsta. NP 1 "fängelse eller dagsböter": valfri ordning (inte NP:s strikta), men inte samma begrepp två gånger (`utbytbara` i verktyget, `olika` i motorns lucktext, Samhälles kopia). NP 5 (Fotboja): ingen bild (dekor, och ett foto på en namngiven person). Flervalets delningsregel (`upgMinst`, minst en rad per sida, bara för flerval) är godkänd.
- **Media-stimulus (Joachim, 2026-11-25):** källtexter och tabeller som eleven läser för att lösa uppgiften står i uppgiften, före svarsdelen, med fyra tillägg i Samhälles motorkopia (`bokskal/README.md`, *Övningar*; PLATTFORMS-ANDRINGAR): (1) ett långt citat delas mellan sina stycken, minst två per sida, källraden med det sista, och ett stycke kan vara en punktlista; (2) `slag: 'tabell'` (rubrik, text före, rader, källrad) är en enhet som aldrig delas, som uppgiftens bild, och citatet har en egen `rubrik` ("Text 1", "Källa 3"); (3) understrecksregeln (F_N) gäller inte i källtexter, tabeller och källrader; (4) långa kolumnnamn i kolumn-krysset bryts på två rader. **NP 4 (2016 B8):** två kolumn-kryss, ett per text, med var sin Rätta ("x av 6"), ingen gemensam knapp. Båda verktygen läser källtexterna (citat med rubrik, listor och källrad) och tabellerna ur markdown (`lasStimulus` i `verktyg/uppgifter-gemensamt.js`), och NP-verktyget läser kryss som står i en markdowntabell (☐).
- **Tema V Media (arbetsorder 2026-11-25):** Läsa, Öva och Nationella prov på temasidan, som tema I–III. Öva: Joachims sex NP-liknande (`NP-liknande_Media_v2.md`; uppgift 2 är flerval); Nationella prov: de fjorton NP-uppgifterna med NP:s facit (`NP_media_med_bedomning_v2.md`; 1 flerval, 2–5 kolumn-kryss, 6–14 öppna). Alla bilder utelämnas (dekor eller ©: de fyra fotona i NP 1, nyhetsstudion i NP 6). Efter NP 1 står en notis (en ruta, som "Tips i provet", Joachims text 2026-11-25): "Obs: Sedan 2019 betalas public service med en avgift via skatten, inte med licens. Presstöd heter numera mediestöd. Facit följer provet från 2018." (`notiser` i `TEMAN`, `verktyg/md-till-np.js`); facit och kryss oförändrade. Ingen lucktext, alltså ingen böjningslista. Inga A-exempel i böckerna, inte heller självmordsexemplet i NP 14; verktygen stoppar också om något annat som citeras i bedömningen (NP 9:s exempelsvar) skulle stå i boken.
- **Tema IV:s uppgiftstyper (Joachim, 2026-11-25):** i Samhälles motorkopia (`bokskal/README.md`, *Övningar*; PLATTFORMS-ANDRINGAR): (1) kolumn-kryss med N kolumner (NP 5: Skola/Kommun/Riksdag/EU); (2) **urvalet** (`slag: 'urval'`, NP 1 Grundlagar): eleven kryssar de rätta i en lista, Rätta ger ✓/✗ vid varje markerat och antal rätt av de rätta, fler kryss än `hogst` är ogiltigt; (3) **matchningen** (`slag: 'matchning'`, NP 4): en lista att välja begreppet ur vid varje förklaring, begreppen i en ruta före (valda tonas), exempelraden med begreppet ifyllt; samma begrepp två gånger är fel på båda. Interaktionen är låst (Joachim, arbetsordern 2026-11-26). Markeringen efter Rätta står med knapparna eller listan, så att raden inte växer (det rättade också tre-kolumnskrysset i tema II NP 1: bara den boken bryts annorlunda).
- **Tema IV Beslutsfattande, Nationella prov (arbetsorder 2026-11-26):** Läsa, Öva och Nationella prov på temasidan, som tema I–III och V. De tio NP-uppgifterna med NP:s facit (`NP_beslutsfattande_med_bedomning.md`). Typerna står i ordern, inte i md:ns Typ-rad (`typer` i `TEMAN`, `verktyg/md-till-np.js`): 1 urval (högst fyra kryss), 2 lucktext med ordruta, 3 flerval (fem alternativ, tolv rader), 4 matchning, 5 kolumn-kryss Skola/Kommun/Riksdag/EU, 6–7 kolumn-kryss stämmer/stämmer inte, 8–10 öppna. Ogiltig-reglerna oförändrade: alla kryss i samma kolumn sätts av verktyget där NP nämner den (NP 5 och 7). Böjningslistan i NP 2 (`TEMAN.beslutsfattande.bestamd`) är Joachims, låst. Efter NP 8 står en notis (Joachims text, med gränsen ur kapitlets sammanfattning): "Obs: Reglerna håller på att ändras. Från den 1 april 2027 krävs dessutom att minst hälften av alla ledamöter röstar ja i det första beslutet och minst två tredjedelar i det andra. Kravet på två beslut med ett riksdagsval emellan gäller fortfarande. Mer står i kapitlets sammanfattning." Ingen notis om landsting/region (NP 3 och 4) eller värnplikt/Nato (hör till A-exemplet i NP 9). Inga bilder, inga A-exempel.
- **Tema IV Beslutsfattande, Öva (arbetsorder 2026-11-26):** Joachims sex NP-liknande (`NP-liknande_Beslutsfattande.md`, `verktyg/md-till-uppgifter.js`): 1 kolumn-kryss Ja/Nej, med facit som Joachims radmappning (Ja 1, 3, 6, 7, 9; Nej 2, 4, 5, 8; `facitrader` i `TEMAN`, md:ns facit är beskrivande); 2 lucktext; 3 kolumn-kryss stämmer/stämmer inte (alla kryss i samma kolumn = ogiltigt, ur texten); 4–6 öppna, skrivmodellen satt per uppgift (`modell` i `TEMAN`): 4 och 5 Redogöra, 6 Resonera. Böjningslistan i uppgift 2 (`TEMAN.beslutsfattande.bestamd`) är Joachims, låst. Inga notiser, inga bilder, inga A-exempel.
- **`uppgiftsbild` (Joachim, 2026-11-24):** en bild som hör till en uppgift (kartan, diagrammet) är en del av övningskomponenten, ingen figur: `{typ: 'uppgift', slag: 'bild', bild: {fil, bredd, hojd, beskrivning, kalla}}`, där den står i uppgiften (i en NP-uppgift före "Tips i provet", som på provet). Den följer inte figurens uppslagsregel och får stå i en bok med `till`; gränsvakten stoppar fortfarande lösa figurer och formler. Måtten i data, högst 45 % av sidhöjden. Återanvändbar för alla ämnens NP. Motorn: Fysikbok a0274dd.
  - **A-exemplen publiceras aldrig:** varken i prompten eller i källkoden. AI:n bedömer mot A-kriteriet och skrivmodellen. Facit i källkoden är accepterat (övningar, inte prov).
  - **Del A (original-NP)** publiceras bara om Joachim säger till och ligger inte i repot.
  - Strular fri-texten i lucktexten byts den mot att välja bland begreppen.
  - **Böjningslistan** (godkända bestämda former, `BESTAMD` i `verktyg/md-till-uppgifter.js`) är bekräftad och låst (Joachim, 2026-11-24). Ändras bara på hans beslut.

### Obeslutat (Regel 0 — fråga Joachim, gissa inte)
1. **Böjningslistan i tema II:s Öva-lucktext** (`TEMAN.styrelseskick.bestamd` i `verktyg/md-till-uppgifter.js`): maktdelningen, enpartistaten, teokratin, censuren, konventionen, civila olydnaden, folkrörelsen, naturrätten. Preliminär tills Joachim bekräftar den.
2. **Övningarna för tema VI:** byggs när materialet finns (samma verktyg; ett prefix per tema i `TEMAN`).

### Sidorna
- `index.html` — startsidan: de sex temana. Ett tema med en repetitionsbok länkar till sin temasida, `infor-slutprovet/<tema>/index.html` (nattordern 2026-11-22: I, II, III och V; IV 2026-11-24; temasidan är ingången sedan 2026-11-24). Ett tema utan är tonat ("Kommer senare"). Under dem står blocket *Inför slutprovet*.
- `infor-slutprovet/index.html` — kapitelindexet: sex kort, tonade ("Kommer snart") tills boken har en sammanfattning. Då byts kortet mot `<a class="kapitel-kort" href="<tema>/index.html">` (temasidan), här och på startsidan.
- `infor-slutprovet/<tema>/` — temasidan, ingången till temat: överst korten Läsa (repetitionsboken) och Öva (övningsboken, där den finns). Mallen ordagrant, `delkapitel.js` och boken i `innehall/repetition.js` (`Bok.niva('repetitionsbok', …)`, tom = "kommer"), skriven av `verktyg/md-till-repetitionsbok.js` ur `kallor/<tema>.md` (se *Textstil*).

### Böckerna och kapitlen (arbetsnamn)
Kapitlet **Inför slutprovet** presenterar sex bläddringsbara böcker, en per tema, som repeterar temat. Varje bok står som "kommer" tills sammanfattningen finns. Böckerna är sammanfattnings-/repetitionstext — inte tre-nivå-texter, flipcards eller elevbok.

De sex temana (arbetsnamn, kan justeras):
1. Individ, migration och minoriteter
2. Styrelseskick — demokrati, autokrati, diktatur och mänskliga rättigheter
3. Lag och rätt
4. Beslutsfattande — Sveriges och EU:s styrelseskick
5. Media
6. Samhälls- och privatekonomi

Startsidan listar de sex temana. De fulla kapitlen byggs senare; till dess länkar ett tema till sin temasida, eller är tonat ("Kommer senare").

**NP-liknande frågor per tema:** beställda 2026-11-23, byggda för tema I–V (se *Beslutat*). Tema VI när materialet finns.

### Textstil (Joachim, 2026-11-22)
Standarden för bokens texter, först repetitionsböckerna i *Inför slutprovet*. Följ den.
- **Löpande prosa, inte punktlista.** Fyllda sidor, få rubriker.
- **Underrubriker är påståenden, inte etiketter.** Korta, runt sex per text.
- **Inga numrerade rubriker.**
- **Nyckelbegrepp i fetstil vid första förekomst** – bara de centrala. Funktionellt.
- **Ca 1500–2000 ord per tema.**
- Bearbetning av Joachims text ändrar **stil, inte innehåll eller fakta**: hans ord och sakuppgifter står kvar.

Så bärs standarden i bokmotorn (repetitionsböckerna):
- **Källan** är `kallor/<tema>.md`, Joachims text i textstilen; hans original ligger ordagrant i `kallor/original/`. `node verktyg/md-till-repetitionsbok.js [tema]` skriver `infor-slutprovet/<tema>/innehall/repetition.js`. Skriv aldrig i den filen för hand.
- **`##`** blir ett avsnitt utan nummer (`numrerad: false`). Avsnitten står i innehållsförteckningen och sidhuvudet. Varje avsnitt börjar på ny sida, så boken har få avsnitt (2–3, som Fysiks texter), och då flödar texten och sidorna fylls.
- **`###`** blir påståenderubriken i texten (`rubrik`). Om ett avsnitt saknar `###` står avsnittets namn som rubrik först.
- **`**ord**`** blir `*ord*`, motorns enda markering (fetstil i accentfärgen). Kursiv finns inte i motorn och blir vanlig text.
- **Motorn delar aldrig ett stycke.** Ett stycke på 8–10 rader som inte ryms flyttar till nästa sida. Sidorna blir därför fyllda till ungefär 55–90 %.

### Klassnamn
Använd **flat naming** (samma som Geografi): `.elevbok-fraga-block`, `.begrepp-kort`, `.skatt-knapp`.

### Pedagogiska principer (samma som Geografi och Historia)
1. Packning-upp av kausala kedjor — INTE bullet-listor som dominerande format
2. Bildguider FÖRE bilder (advance organizer)
3. Djupdykningar i "Vill du veta mer?"-sektion längst ner i Läs-fliken
4. Differentiering: tre textnivåer per avsnitt (gäller de fulla kapitlen; repetitionsböckerna i *Inför slutprovet* är nivålösa, se *Beslutat*)
5. Stödord och startfraser på flipcards-redogörelsekort
6. Inga skuldläggningar — alltid positiv inramning

---

## Vad som ligger i repot och varifrån

| Sökväg | Vad | Källa (ordagrant) |
|---|---|---|
| `bokskal/` | bokmotorn; `README.md` är Fysiks handbok | Fysikbok 5a53cf6: `bokskal/`, `README.md` |
| `mall/delkapitel/` | mallen för en bok-sida | Fysikbok `mall/delkapitel/`; `index.html` med titeln och `css/bok-samhalle.css` (som Geografis mall) |
| `css/bok-samhalle.css` | samhällets färg ovanpå motorn | Geografis `css/bok-geografi.css` som mönster |
| `verktyg/fargprov/` | färgprovet A/B/C (inte elevinnehåll; grinden letar inte i `verktyg/`) | nytt |
| `mall/nav-skal/startsida.html` | nav-skal: bokens startsida (`.kapitel-kort`, tonat = `dimmad`) | Geografibok `index.html` |
| `mall/nav-skal/kapitelindex.html` | nav-skal: kapitelindex | Geografibok `delkapitel/ekonomisk-geografi/index.html` |
| `css/geografi.css` | plattformens delade designsystem (tokens, komponenter) | Geografibok `css/geografi.css` |
| `verktyg/bok-grind.js`, `verktyg/provbok*/`, `verktyg/provkapitel.js` | motorns verifiering och dess provdata | Fysikbok 3c3cc86 `verktyg/` |
| `doc/KOMPONENTER-INNEHALL-HISTORIA-v1.10.md` | komponenter för innehållsproducenter | Historiabok `doc/` |
| `doc/LEVERANSGUIDE-INNEHALL v2.1.md` | leveransguide för innehållsproducenter | Historiabok `doc/` (identisk med Geografis) |
| `doc/avsnitts-scaffold-mall.html` | komponent-template (avsnitts-scaffold) | Historiabok `doc/` |
| `kallor/original/` | Joachims sammanfattningar, ordagrant som de levererades | Joachim (Hämtade filer, 2026-11-22; beslutsfattande 2026-11-24) |
| `kallor/<tema>.md` | sammanfattningarna i textstilen (källan till böckerna) | `kallor/original/` + stilbearbetningen (beslutsfattande.md: en ordagrann kopia, texten var redan i textstilen) |
| `verktyg/md-till-repetitionsbok.js` | för in `kallor/<tema>.md` i temats `innehall/repetition.js` | nytt, som Fysiks `verktyg/kap3-omvandlare.js` |
| `kallor/ovningar/skrivmodell.md` | skrivmodellen (Del C ur det samlade materialet, ordagrant), samma för alla teman och båda övningsböckerna | Joachim (Samlat material, 2026-11-23) |
| `kallor/ovningar/ai-mall.txt` | AI-mallen för återkoppling på öppna svar, en mall för alla uppgifter; avsnittet med A-exemplet utbytt mot skrivmodellen (beslutet 2026-11-23) | Joachim (arbetsordern) |
| `verktyg/md-till-uppgifter.js` | för in Del B och Del C ur Joachims samlade material (Hämtade filer, inte i repot) i temats `innehall/ovningar.js`; läser aldrig A-exemplen och stoppar om en mening ur ett A-exempel skulle hamna i boken | nytt |
| `infor-slutprovet/<tema>/innehall/ovningar.js` | temats övningsbok (genererad, skriv inte för hand) | `verktyg/md-till-uppgifter.js` |
| `verktyg/md-till-np.js` | för in Del A (de riktiga NP-uppgifterna) och Del C i temats `innehall/nationella-prov.js`; läser aldrig A-exemplen in i boken. Godkända bilder i `BILDER` (temasidans `bilder/`) | nytt (2026-11-24) |
| `verktyg/uppgifter-gemensamt.js` | det som de två övningsverktygen delar: märkningen, skrivmodellen, prompten, facit med nyckelord och spärren mot A-exemplen | nytt (2026-11-24) |
| `infor-slutprovet/<tema>/innehall/nationella-prov.js` | temats Nationella prov-bok (genererad, skriv inte för hand) | `verktyg/md-till-np.js` |

Mallarna i `mall/nav-skal/` är referenser, inte sidor i boken: de pekar fortfarande på Geografis innehåll och sökvägar.

---

## Arbetsregler för Code

### Gör
- Kopiera kanoniska mönster från Geografi-repot rakt av
- Validera med `node --check` på alla JS
- Verifiera JSON är giltig
- Behåll print-CSS-mönstret från Geografi (`@media print`)
- Kör bokmotorns grind (`node verktyg/bok-grind.js`) när en bok-sida finns
- Skriv `STATUS.md` och `TODO.md` när relevant — det är arbetsverktyg

### Gör INTE
- Uppfinn nya komponenter — om något saknas, **fråga ramverks-chatten** först
- Ändra plattformens fonter eller bas-palett
- Skapa parallella system till befintliga komponenter
- Ändra bokmotorn (`bokskal/`) utan Joachims godkännande
- Producera pedagogiskt innehåll (texter, frågor) — det gör innehållsproduktion-chatten
- Använd flat-naming där Geografi-versionen redan har BEM

### När du är osäker
1. Kolla först om Geografi-repot löst det
2. Kolla `PLATTFORMS-ANDRINGAR.md` om något är planerat att ändras
3. Fråga Joachim, som rådfrågar ramverks-chatten

---

## PLATTFORMS-ANDRINGAR.md
En instans av plattforms-ändringsdagboken ligger i repot. Observationer som påverkar plattformen läggs där, inte fixas direkt. Veckogenomgång på söndagar.

---

## Hänvisningar
- Plattformsspec Lager 1: `https://github.com/jb873/alphaskolans-larplattform/blob/v0.3/css/as-base.css`
- Lager 2-3-utökning: ramverks-chatten har originalet
- Geografi-repot (referens-implementation): `https://github.com/jb873/Geografibok`
- Historia-repot (innehållsram): `https://github.com/jb873/Historiabok`
- Fysikbok (bokmotorns ursprung, nyare motor): `https://github.com/jb873/Fysikbok`, lokalt `C:\Users\jb\Documents\Fysik`
