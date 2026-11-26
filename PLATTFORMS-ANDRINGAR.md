# Plattforms-ändringar — Alphaskolans lärplattform

> Pedagogisk arbetsdagbok. Här samlas observationer som *kan* påverka 
> plattformen — innan de blir formella ändringar. Förhindrar drift 
> mellan böcker och kapitel.

**Starta varje arbetsdag med att kolla 🔵-listan.** 
**Veckogenomgång:** söndagar (eller när 🔵-listan har 3-5 poster).

---

## Snabbreferens — tre typer av ändringar

| Typ | Vad | Hantering |
|---|---|---|
| **A** Innehåll | Texten i ett avsnitt, en bild, en faktaformulering | Fixa direkt. Gå vidare. Hör inte hemma här. |
| **B** Mönster | Hur en komponent ser ut eller fungerar (flikar, kort, navigation) | Lägg i 🔵-listan nedan. Ändra INTE direkt i boken. |
| **C** Plattform | Pedagogisk modell (trösklar, lägen, korttyper, kunskapskrav-modell) | Lägg i 🔵-listan nedan. Ändra INTE direkt i boken. |

**Tumregel:** Om upptäckten kan tänkas påverka *ett annat avsnitt eller en annan bok* → det är B eller C. Skriv ner.

---

## Statuskoder

| Symbol | Betydelse |
|---|---|
| 🔵 | Ny observation — att bedöma på nästa veckogenomgång |
| 🟡 | Beslutat — väntar på implementation |
| 🟢 | Implementerat i plattformsspec — väntar migration av befintliga böcker |
| ✅ | Klart överallt |
| ⏸️ | Pausat / skjutet framåt |
| ❌ | Förkastat efter övervägande |

---

## 🔵 Aktiv lista — att bedöma

| Datum | Typ | Var upptäckt | Observation | Förslag |
|---|---|---|---|---|
| 2026-11-22 | C | Samhällsboken, grinden | Fysiks `bok-grind.js` blandar motorprov och Fysiks eget innehåll: startsidans kapitel och Nästa steg (hårdkodade Fysik-mappar), källfilerna `STROM_MAPPAR`/`STROM_KALLOR`, negativa prov mot `rorelse_och_kraft` och webbadressen `jb873.github.io/Fysikbok`. Den går inte att köra rakt av i en annan bok, och Geografi och Samhälle får då var sin variant av grinden. | Dela grinden i en motordel (bokskal, provböckerna, varje delkapitel som hittas) som följer med motorn, och en bokdel per bok (startsida, källor, webbadress). Till dess: kontrolläget (`?kontroll`) används per sida. **Joachim 2026-11-22: rätt och nödvändigt, men ett eget spår.** Nattordern 2026-11-22: `node verktyg/bok-grind.js --bara=<tema>` går att köra här – temasidornas prov blir gröna, men startsidans prov (Fysiks kapitel och Nästa steg) blir alltid röda. |
| 2026-11-22 | B | Samhällsboken, grinden (nattordern) | Grindens prov "hubb (allt kommer)" förutsätter en sida med nivåer: Läs ska säga "Texterna kommer." och varje nivåknapp vara tonad. En nivålös sida med bara en tom repetitionsbok (`nivaer: []`, `flikar: false`; Samhällets IV och VI) blir därför röd i 2 av 5 prov, fast kontrolläget är grönt och kortet är tonat och inte går att öppna. De fyra byggda temasidorna är gröna i alla fyra lägen. | I Fysikbok (enkällig motor och grind): när sidan inte har några nivåer prövar `HUBB_KOMMER` i stället att varje fristående boks kort är tonat ("kommer") och inte öppnar någon bok. Rör inte grinden här. |


*(Tom rad ovan är till för nya poster — fyll på underifrån)*

### Exempel på hur en post fylls i:

| Datum | Typ | Var upptäckt | Observation | Förslag |
|---|---|---|---|---|
| 2026-06-15 | C | Demografi-pilot, klassrum | 15 ord + nyckelord = för högt tröskel. Eleverna skrev korrekt men "fel" ord, blev blockerade. | 8 ord, inga nyckelord, dynamisk upplåsning |

---

## 🟡 Beslutat — väntar implementation

| Datum | Beslut | Påverkar | Status |
|---|---|---|---|
| 2026-11-22 | Fysiks bokmotor är standarden för nya böcker, inte Geografis kopia (Geografis tillägg `villVetaMer`, `bild`, `fundera` finns inte i Fysiks) | Samhällsboken, framtida böcker | Samhällsboken har Fysikbok 3c3cc86 |
| 2026-11-22 | Samhällsbokens sidor ligger i Fysiks form, två mappar djupt: `infor-slutprovet/<tema>/` | Samhällsboken | Gäller |
| 2026-11-22 | Samhällets signaturfärg: plommon/aubergine, enda ämnesegna färgen; nyans C, djup aubergine `#5b2f4e`, vald på ögat i `verktyg/fargprov/` | Samhällsboken | Gäller (`css/bok-samhalle.css`) |
| 2026-11-25 | **Flervalet (`slag: 'flerval'`) byggs i Samhälles kopia av motorn, inte i Fysik** (Joachim): fysiksessionen äger Fysik-mappen tills order 38 är klar. Ett kryss per rad bland radens egna alternativ (NP 2018 A3 Juridiska begrepp, tema III NP 2), rättas som kolumn-krysset; en flervalsrad är en hel delfråga, så gruppen får delas med en rad per sida (`upgMinst`). Samma dag, samma väg: lucktextens `olika` (luckor i valfri ordning, men inte samma begrepp två gånger; tema III NP 1 "fängelse eller dagsböter"), en kontroll i `Bok.uppgiftRattning.uppgift`. Samhälles `bokskal/` avviker därför från Fysikbok 5a53cf6 i `bok.js`, `bok.css` och `README.md` (Övningar). Ramverks-chatten beskriver ändringen för fysiksessionen. | Bokmotorn (enkällig), Samhällsboken | Väntar: infälls i Fysiks kanoniska motor senare, med öppna-layouten; sedan kopieras motorn hit byte för byte igen |
| 2026-11-25 | **Uppgiftens källtexter och tabeller (Media) byggs i Samhälles kopia av motorn, inte i Fysik** (Joachim), samma väg som flervalet. Fyra tillägg i övningskomponenten: (1) ett citat med flera stycken delas mellan styckena när det är högre än sidan, minst två stycken per sida och källraden med det sista (grupp av slag `citat`, som en punktlista; regelkoll), och ett stycke kan vara en punktlista; (2) `slag: 'tabell'` (`uppgiftstabell`: rubrik, text före, tabell, källrad) som en enhet som aldrig delas, som uppgiftens bild, och citatet får `rubrik` ("Text 1", "Källa 3") som står med första stycket; (3) understrecksregeln (F_N → index) gäller inte i uppgiftens källtexter, tabeller och källrader (`kallText`: `friends_n_trapport_2013` står rakt); (4) kolumn-kryssets knappar får krympa till det längsta ordet, så ett långt kolumnnamn bryts på två rader (`.upg-val`). Alla befintliga böcker bryts sida för sida som förut (171 böcker × mått). Ramverks-chatten beskriver ändringen för fysiksessionen. | Bokmotorn (enkällig), Samhällsboken | Väntar: infälls i Fysiks kanoniska motor senare, med flervalet och öppna-layouten; sedan kopieras motorn hit byte för byte igen |
| 2026-11-25 | **Tre nya uppgiftstyper för tema IV byggs i Samhälles kopia av motorn, inte i Fysik** (Joachim), samma väg som flervalet: (1) kolumn-kryss med N kolumner (strukturkollen kräver två eller fler, inte två eller tre); (2) urvalet, `slag: 'urval'` (`alternativ`, `svar: [index]`, `hogst`): en rad per alternativ med kryssruta, Rätta ✓/✗ vid de markerade och antal rätt av de rätta, fler kryss än `hogst` ogiltigt (`Bok.uppgiftRattning.uppgift` ger `ogiltig: 'antal'`, annars `'kolumn'` som förut); (3) matchningen, `slag: 'matchning'` (`alternativ`, `rader: [{etikett, text, svar, exempel?}]`): en `<select>` per förklaring, begreppsrutan före gruppen (`uppgiftsord` med `fasta`), exempelraden `uppgiftsexempel`, samma begrepp två gånger fel på båda. Samtidigt: markeringen efter Rätta står i knapparnas eller listans enhet (tre eller fler kolumner, matchningen), så att raden inte växer efter Rätta – det ändrar brytningen bara i tema II:s Nationella prov-bok (NP 1, tre kolumner); alla andra böcker är oförändrade. Matchningens interaktion väntar på Joachims bekräftelse. | Bokmotorn (enkällig), Samhällsboken | Väntar: infälls i Fysiks kanoniska motor senare, med flervalet och Media-tilläggen |
| 2026-11-26 | **Staplad kryssruta för långa kolumn-kryss byggs i Samhälles kopia av motorn, inte i Fysik** (Joachim), samma väg som flervalet: `staplad: true` på ett kolumn-kryss-block (eller på uppgiften utan block) ritar kolumnerna under påståendet, en per rad med en fyrkantig ruta framför, med flervalets markup (`.upg-flerval.upg-staplad`, `.upg-alt`); en markerad ruta har ett kryss (`bok.css`). Ett kryss per rad, Rätta och `ogiltigSammaKolumn` oförändrade (samma rättning som kolumn-krysset). Regeln: långa kolumnnamn (flera ord, en mening) staplade, korta sida vid sida, gränsfall sida vid sida, taggat per block. Strukturkollen: `staplad` är `true` eller saknas. Bara tema II:s Nationella prov-bok ändras (NP 1 och NP 3:s första block); alla andra böcker bryts sida för sida som förut. | Bokmotorn (enkällig), Samhällsboken | Väntar: infälls i Fysiks kanoniska motor senare, med flervalet, Media-tilläggen och tema IV:s typer. Utseendet väntar på Joachims bekräftelse |
| 2026-11-26 | **Marginalfelet vid "Fortsätter på nästa sida" lagas i Samhälles kopia av motorn, inte i Fysik** (Joachim), samma väg: efterpassets rad `.b-fortsatter` står sist i sidinnehållet, så sidans sista block var inte `:last-child` och behöll sin marginal under (`.sidinnehall > :last-child { margin-bottom: 0 }` slog inte till). Sidan blev 3–10 px högre än brytningen räknat och visade "mer längre ner på sidan" ovanpå raden. Lagningen, i `bok.css`: `.sidinnehall > :has(+ .b-fortsatter:last-child) { margin-bottom: 0 }` (och samma för `.b-rutarad`, som har en egen `!important`-regel). Brytningen är oförändrad i alla böcker, bara visningen. Felet finns i Fysikbok 5a53cf6:s efterpass (väg 3) och gäller alla böcker med `till`. Samtidigt i Samhälles grind (`verktyg/bok-grind.js`, inte motorn): genomgången av varje sida mäter också höjden som eleven ser den, efter efterpasset. | Bokmotorn (enkällig), Samhällsboken | Väntar: infälls i Fysiks kanoniska motor senare, med övriga Samhälle-tillägg; grindens skärpning kan tas med till Fysiks grind |

---

## ⏸️ Pausat / skjutet framåt

| Datum | Vad | Varför | Återuppta när |
|---|---|---|---|
| 2026-11-22 | NP-liknande frågor per tema, utifrån analys av offentliga nationella prov | Senare fas enligt Joachims beställning | Joachim beställer det (tema I beställt och byggt 2026-11-23) |
| 2026-11-24 | Läsa och Öva som lägen i samma bok (en växel inne i boken) i stället för två böcker | En medveten ändring i motorn (Fysikbok), inte nu (Joachim) | Joachim beställer den |

---

## ✅ Genomfört

| Datum | Vad |
|---|---|
| 2026-11-25 | **De öppna uppgifternas uppslag** (Joachim): uppgiftstexten på en vänstersida, skrivmodellen direkt efter på högersidan (aldrig en tom sida emellan), svarsrutan på ny sida – i normalfallet nästa uppslag. `till: 'uppslag'` i den delade övningskomponenten, för alla ämnens öppna uppgifter. Ersätter samma dags kompakta regel (text och modell på en sida), som aldrig slog till och är borttagen. Textböckerna oförändrade (jämförelsen gammal motor mot ny). Motorn: Fysikbok 5a53cf6. |
| 2026-11-24 | **Kolumn-kryss** (Joachim, godkänt): en självrättande kryss-typ i den delade övningskomponenten (`slag: 'kryss'`), 2–3 kolumner och raderna som data, och flera block med egna kolumner och text (`delar`). Ersätter tvåvalet (`tvaval`): Ja/Nej och stämmer i tema I är flyttade hit, och de ritas och bryts byte för byte som förut (jämförelsen gammal motor mot ny). NP:s regel om alla kryss i samma kolumn behålls per uppgift. Dessutom `slag: 'citat'`, en citerad ingång inne i uppgiften. Bara i övningskomponentens del av motorn; textböckerna oförändrade. Motorn: Fysikbok 8aecb03. |
| 2026-11-24 | **`uppgiftsbild`** (Joachims order): en bild som hör till en uppgift är en del av övningskomponenten (`slag: 'bild'`, `bild: {fil, bredd, hojd, beskrivning, kalla}`), ingen figur. Den följer inte figurens uppslagsregel, så en bok med `till` får ha den; gränsvakten stoppar fortfarande bara lösa `figur`/`formel`. Måtten i data (samma brytning i kontrolläget som för eleven), högst 45 % av sidhöjden. Bara i övningskomponentens egen del av motorn; textböckerna bryts byte för byte som förut (jämförelsen gammal motor mot ny). Återanvändbar för alla ämnens NP. Motorn: Fysikbok a0274dd. |
| 2026-11-24 | **Vänster- och högersidor (väg 3, efterpasset)** (Joachims order): `till: 'vanster'`/`'hoger'` på ett avsnitt eller `{typ: 'sidbrytning', till}`. Ett efterpass efter färdigbrutna sidor lägger in en utfyllnadssida "Fortsätter på nästa sida" där en sida annars börjar på fel sida av uppslaget, och samma rad längst ned på en högersida där uppgiften fortsätter. Körs bara i en bok med `till` och bara med uppslag; sid-utjämningen är orörd, och textböckerna bryts byte för byte som förut (jämförelsen gammal motor mot ny). Samhälles övningsbok: kryssuppgifterna börjar på en vänstersida, skrivmodellen till vänster och svarsrutan överst till höger. **Gränsen:** en bok med `till` får inte ha figurer eller formler (en utfyllnadssida flyttar sidorna efter den, och uppslagsregeln för figuren kan då brytas); kontrolläget stoppar med fel. Behövs det måste `till` in i själva utjämningen, och då rörs den delade koden. Motorn: Fysikbok bdc9e15. |
| 2026-11-24 | **Temasidan är ingången** (Joachim): "Temasidan är ingången. Startsidans kort leder till temasidan. Överst på temasidan väljer eleven Läsa (repetitionsboken) eller Öva (övningsboken, där den finns)." I Samhällsboken med det som finns: startsidans och kapitelindexets kort går till temasidan, och böckernas kort överst heter "Läsa: <tema>" och "Öva: <tema>". Inget nytt i motorn. |
| 2026-11-23 | Läsböckernas delade övningskomponent, blocktypen `uppgift` (tvåval, lucktext och öppen uppgift med AI-mallen att kopiera), beslutad av Joachim 2026-11-23: i Fysikbok 6297bbf (committad och pushad där), kopierad hit byte för byte. Beslut och bygge: `doc/FORSLAG-UPPGIFTER.md`. Kemis *Testa dig själv* ingår inte (beslut 2: bara de tre typerna). |
| 2026-11-22 | Repetitionstema = nivålös *repetitionsbok*, en femte sort fristående bok i Fysiks motor (alternativ C): i Fysikbok 3c3cc86 (committad och pushad där), kopierad hit byte för byte |

---

## ❌ Förkastat

| Datum | Vad | Varför |
|---|---|---|

---

## Veckogenomgång — söndag (eller när 🔵-listan har 3-5 poster)

**Tid:** ~30 minuter

**Steg:**

1. **Gå igenom 🔵-listan post för post.**
   - För varje: är det A (fel kategori — flytta ut)? B eller C (rätt)?
   - Bedöm pedagogiskt: är det rätt riktning?
   - Bedöm omfattning: är det en isolerad ändring eller pekar det på något större?

2. **Tre möjliga utfall per post:**
   - 🟡 **Godkänd** → flytta till 🟡-listan + skapa arbetsorder till ramverks-chatten
   - ❌ **Förkastad** → flytta till ❌-listan med kort motivering
   - 🔵 **Behöver mer underlag** → behåll i 🔵, anteckna vad som behöver utforskas först

3. **Granska 🟡-listan:**
   - Vilka kan släppas till implementation den här veckan?
   - Vilka väntar på något (t.ex. annan komponent klar)?
   - Finns det blockeringar att hantera?

4. **Granska 🟢-listan:**
   - Vilka migrationer ska göras den här veckan?
   - Behövs prioritering om kö växer?

5. **Reflektera över mönster:**
   - Dyker liknande observationer upp upprepade gånger?
   - Då pekar de mot något större — kanske en arkitektur-ändring snarare än enskild komponent.

**När det är klart:** stäng filen, fortsätt arbeta tryggt vetande att inget glöms.

---

## Regler

**1. Ändra aldrig direkt i en bok när du upptäcker B eller C.**
Lägg i 🔵-listan. Geologi-kapitlet får ha sin ofullständighet en dag till.

**2. Innehållsproduktion-chatten lägger till i 🔵.**
Den ändrar aldrig plattformen själv.

**3. Ramverks-chatten är den som flyttar mellan listor.**
Veckogenomgång görs där.

**4. Code-chatten implementerar 🟡 och 🟢.**
Den uppdaterar inte den här filen — det gör ramverks-chatten efter Code rapporterat klart.

**5. När i tvivel — skriv ner.**
Hellre en post för mycket än en ändring som glöms.
