# CLAUDE.md — Samhällsboken

> Designstandard och arbetsregler för Code när Code arbetar i
> Samhällsboken-repot. Läs varje gång du startar en ny session.

**Senast uppdaterad:** 2026-11-22
**Plattformsversion:** Alphaskolans lärplattform v0.3 (Lager 1) + Lager 2-3-utökning v0.1
**Bok-status:** 2026-11-22 (nattordern): motorn är Fysikbok 3c3cc86 med repetitionsboken. Fyra av sex repetitionsböcker i *Inför slutprovet* är byggda (I Individ, migration och minoriteter, II Styrelseskick, III Lag och rätt, V Media). IV Beslutsfattande och VI Samhälls- och privatekonomi saknar text och står som "kommer". Se *Obeslutat* nedan.

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
- **Bokformatet** (bläddringsbara böcker) är bokmotorn i [`bokskal/`](bokskal/). **Fysiks motor är standarden** (Joachims beslut 2026-11-22), kopierad ordagrant från Fysikbok 3c3cc86 (2026-11-22, med repetitionsboken) — inte Geografis äldre kopia. Motorns handbok är Fysiks README, här [`bokskal/README.md`](bokskal/README.md).
- **Enkällig motor:** motorn ändras aldrig här. Ändringar görs i Fysikbok och kopieras hit byte för byte (se `PLATTFORMS-ANDRINGAR.md`).

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

### Obeslutat (Regel 0 — fråga Joachim, gissa inte)
1. **NP-liknande frågor per tema** (senare fas): var de bor på temasidan (Öva-flik eller en övningsbok) beslutas när de beställs.

### Sidorna
- `index.html` — startsidan: de sex temana. Ett tema med en repetitionsbok länkar till den tills det fulla kapitlet finns (nattordern 2026-11-22: I, II, III och V). Ett tema utan är tonat ("Kommer senare"). Under dem står blocket *Inför slutprovet*.
- `infor-slutprovet/index.html` — kapitelindexet: sex kort, tonade ("Kommer snart") tills boken har en sammanfattning. Då byts kortet mot `<a class="kapitel-kort" href="<tema>/index.html#repetition-<tema>">`, här och på startsidan.
- `infor-slutprovet/<tema>/` — temasidan: mallen ordagrant, `delkapitel.js` och boken i `innehall/repetition.js` (`Bok.niva('repetitionsbok', …)`, tom = "kommer"), skriven av `verktyg/md-till-repetitionsbok.js` ur `kallor/<tema>.md` (se *Textstil*).

### Böckerna och kapitlen (arbetsnamn)
Kapitlet **Inför slutprovet** presenterar sex bläddringsbara böcker, en per tema, som repeterar temat. Varje bok står som "kommer" tills sammanfattningen finns. Böckerna är sammanfattnings-/repetitionstext — inte tre-nivå-texter, flipcards eller elevbok.

De sex temana (arbetsnamn, kan justeras):
1. Individ, migration och minoriteter
2. Styrelseskick — demokrati, autokrati, diktatur och mänskliga rättigheter
3. Lag och rätt
4. Beslutsfattande — Sveriges och EU:s styrelseskick
5. Media
6. Samhälls- och privatekonomi

Startsidan listar de sex temana. De fulla kapitlen byggs senare; till dess länkar ett tema till sin repetitionsbok, eller är tonat ("Kommer senare").

**Senare fas (bygg INTE nu):** NP-liknande frågor per tema, utifrån analys av offentliga nationella prov. Plats lämnas för dem, men inget byggs förrän Joachim beställer det.

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
| `bokskal/` | bokmotorn; `README.md` är Fysiks handbok | Fysikbok 3c3cc86: `bokskal/`, `README.md` |
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
| `kallor/original/` | Joachims sammanfattningar, ordagrant som de levererades | Joachim (Hämtade filer, 2026-11-22) |
| `kallor/<tema>.md` | sammanfattningarna i textstilen (källan till böckerna) | `kallor/original/` + stilbearbetningen |
| `verktyg/md-till-repetitionsbok.js` | för in `kallor/<tema>.md` i temats `innehall/repetition.js` | nytt, som Fysiks `verktyg/kap3-omvandlare.js` |

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
