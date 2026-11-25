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
| 2026-11-25 | **Kompakt layout för öppna uppgifter** (Joachims order): skrivmodellen tvingar ingen ny sida utan flödar efter uppgiftstexten och ska stå på en vänstersida (`sidaTill`); ryms text och modell delar de vänstersidan och svarsrutan står till höger, annars behålls delningen. I övningskomponenten och efterpasset, för alla ämnens öppna uppgifter. Textböckerna oförändrade (jämförelsen gammal motor mot ny). Mätt: ingen av Samhällets 14 öppna uppgifter ryms i dag. Motorn: Fysikbok 54cbe79. |
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
