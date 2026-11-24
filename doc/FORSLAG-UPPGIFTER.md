# Övningskomponenten: beslut och bygge

**Status:** beslutat av Joachim 2026-11-23 och byggt. Komponenten finns i motorn i Fysikbok 6297bbf och är kopierad hit byte för byte. Handboken är `bokskal/README.md`, avsnittet *Övningar*.

## Besluten

| | Beslut | Så är det byggt |
|---|---|---|
| A-exemplen | Finns inte i den publicerade övningen, varken i prompten eller i källkoden. AI:n bedömer mot A-kriteriet och skrivmodellen. | `kallor/ovningar/ai-mall.txt`: avsnittet med exemplet är utbytt mot skrivmodellen, och steg 1 jämför med kriteriet och skrivmodellen. `verktyg/md-till-uppgifter.js` läser aldrig A-exemplen. Den stoppar om en mening ur ett A-exempel skulle hamna i boken. |
| Facit | Får stå i källkoden: rättningen sker i webbläsaren, och det här är övningar, inte prov. | Facit står i `innehall/ovningar.js` och ritas aldrig. |
| 1. Plats | I motorn och enkällig. Byggs och kopieras som resten av motorn. | Blocktypen `uppgift` i `bokskal/bok.js` och `bok.css` (Fysikbok), kopierad hit. |
| 2. Typer | Lucktext, Ja/Nej och stämmer/stämmer inte, inget mer. | Slagen `tvaval` (Ja/Nej och Stämmer/Stämmer inte) och `lucktext`, och `oppen` för de öppna uppgifterna (svarsrutan och kopiera-knappen). |
| 3. Efter Rätta | ✓/✗ per rad och antal rätt, utan facit och utan E/C/A. | "7 av 9 rätt." och "2 utan svar." |
| 4. Lucktexten | Eleven skriver, och rättningen är generös: bestämd form och stora eller små bokstäver godkänns. | Motorn bortser från stora och små bokstäver, mellanslag och skiljetecken. De bestämda formerna står i verktyget (`BESTAMD`). **Listan är preliminär** och väntar på Joachims bekräftelse, se nedan. |
| 5. Svarsrutan | Ja. Knappen kopierar hela prompten med svaret ifyllt, utan A-exemplet. | Svaret ersätter "[klistras in av eleven]". Svaret sparas per elev. |
| 6. Skrivmodellen | Redogöra och Resonera, inte bedömnings- och nivådelarna. | Uppgift 4–5 (beskriv) visar Redogöra. Uppgift 6 (resonera) visar Redogöra och Resonera. Samma text står i prompten. |
| 7. Platsen på temasidan | En egen bok bredvid repetitionsboken. | *Öva inför slutprovet: Individ, migration och minoriteter* i `repetitionsbocker`, adressen `#repetition-ova-individ-migration-minoriteter`. |
| Mobilen | Låg prioritet: fixa om det är enkelt, annars senare. | Inte fixat. Att hålla begreppen ihop med meningarna gav en sida på 39 % på 1366×633. Begreppen står därför före meningarna; på datorn på samma uppslag, på mobilen sidan före. |

## Böjningslistan (preliminär, väntar på bekräftelse)

Godkända svar utöver facit, med stora eller små bokstäver:

| Facit | Godkänns också |
|---|---|
| födelseöverskott | födelseöverskottet |
| urbanisering | urbaniseringen |
| assimilation | assimilationen |
| flykting | flyktingen |
| fri rörlighet | fri rörligheten, fria rörligheten |
| socialt arv | sociala arvet |
| urfolk | urfolket |
| permanent uppehållstillstånd | permanenta uppehållstillståndet |

## Det som inte byggdes

- **Kemis frågetyper och bytet av Kemis *Testa dig själv*.** Enligt beslut 2 byggdes inget mer än de tre typerna.
- **En separat fil `bokskal/uppgifter.js`.** Förslaget hade den för att Kemi skulle kunna ladda den. Utan Kemi skulle en ny fil ändra mallen i alla böcker, så komponenten står i `bok.js`. Rättningen är ändå en ren funktion, `Bok.uppgiftRattning`.
- **Grindprov för Rätta.** Kontrolläget prövar övningarnas data och sidbrytning i alla lägen. Ett prov som klickar Rätta hör hemma i grinddelningen, som är ett eget spår.
