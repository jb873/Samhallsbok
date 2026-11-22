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
| 2026-11-22 | C | Samhällsboken, repetitionsboken | En femte sort fristående bok (*repetitionsbok*) behövs i motorn, och motorn ska vara enkällig (Fysikbok). Uppmätt tillägg: `bok.js` +5/−2 rader (en rad i `SLAG`, ett kortblock, dess plats först i Läs, en kommentar), `bok.css` 1 rad, `bok-grind.js` 4 rader (sorten i rundan; omslagsprovet läser sortens överrad i stället för "NÄSTA STEG"; djupdykningsblocket utesluter sorten), provboken +1 rad och en provfil, README +1 tabellrad. Provkört i scratch: sida utan nivåer, fylld bok och tom bok ("kommer"), kontrolläget grönt. | (1) Patchen läggs i Fysikbok först (en egen order, efter Fysiks pågående ocommittade arbete i `README.md` och `bok-grind.js`; patchen går in rent ovanpå det), Fysiks grind körs, commit i Fysikbok; Samhällsboken kopierar sedan `bokskal/` byte för byte från den committen. Rekommenderas. (2) Portabelt tillägg som Fysik adopterar: går inte utan att motorn först får ett register-API för sorter (`SLAG` är en konstant i motorns stängda funktion) — större ändring, samma väg via Fysikbok. |
| 2026-11-22 | C | Samhällsboken, grinden | Fysiks `bok-grind.js` blandar motorprov och Fysiks eget innehåll: startsidans kapitel och Nästa steg (hårdkodade Fysik-mappar), källfilerna `STROM_MAPPAR`/`STROM_KALLOR`, negativa prov mot `rorelse_och_kraft` och webbadressen `jb873.github.io/Fysikbok`. Den går inte att köra rakt av i en annan bok, och Geografi och Samhälle får då var sin variant av grinden. | Dela grinden i en motordel (bokskal, provböckerna, varje delkapitel som hittas) som följer med motorn, och en bokdel per bok (startsida, källor, webbadress). Till dess: Samhällsboken kör inte grinden; kontrolläget (`?kontroll`) används per sida. **Joachim 2026-11-22: rätt och nödvändigt, men ett eget spår.** |

*(Tom rad ovan är till för nya poster — fyll på underifrån)*

### Exempel på hur en post fylls i:

| Datum | Typ | Var upptäckt | Observation | Förslag |
|---|---|---|---|---|
| 2026-06-15 | C | Demografi-pilot, klassrum | 15 ord + nyckelord = för högt tröskel. Eleverna skrev korrekt men "fel" ord, blev blockerade. | 8 ord, inga nyckelord, dynamisk upplåsning |

---

## 🟡 Beslutat — väntar implementation

| Datum | Beslut | Påverkar | Status |
|---|---|---|---|
| 2026-11-22 | Fysiks bokmotor är standarden för nya böcker, inte Geografis kopia (Geografis tillägg `villVetaMer`, `bild`, `fundera` finns inte i Fysiks) | Samhällsboken, framtida böcker | Samhällsboken har Fysikbok 9247345 |
| 2026-11-22 | Repetitionstema = nivålös *repetitionsbok*, en femte sort fristående bok i Fysiks motor (alternativ C) | Fysikbok (motorn), Samhällsboken | Godkänt: i Fysikbok först, committat där, kopierat hit |
| 2026-11-22 | Samhällsbokens sidor ligger i Fysiks form, två mappar djupt: `infor-slutprovet/<tema>/` | Samhällsboken | Gäller |
| 2026-11-22 | Samhällets signaturfärg: plommon/aubergine, enda ämnesegna färgen; nyans C, djup aubergine `#5b2f4e`, vald på ögat i `verktyg/fargprov/` | Samhällsboken | Gäller (`css/bok-samhalle.css`) |

---

## ⏸️ Pausat / skjutet framåt

| Datum | Vad | Varför | Återuppta när |
|---|---|---|---|
| 2026-11-22 | NP-liknande frågor per tema, utifrån analys av offentliga nationella prov | Senare fas enligt Joachims beställning | Joachim beställer det |

---

## ✅ Genomfört

| Datum | Vad |
|---|---|

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
