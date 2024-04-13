# Konfiguration der Eingabemaske für Prüfungspläne aus Studierendensicht

Die Ansicht der Prüfungsplan-Eingabemaske für Studierende lässt sich wie folgt im Code anpassen: 
- die maximalen Zeichenanzahlen lassen sich an folgenden Stellen setzen: 
    - Bereich "Weitere Anmerkungen zum Prüfungs- bzw. Nebenfachplan": Zeile 20 und 27 in `client/student/src/components/examPlanForm.tsx`
    - Bereich "Name des Moduls", wenn Leistungen hinzugefügt werden: Zeile 71 und 75 in `client/student/src/components/externalModules.tsx`
    - Bereich "Anzahl CP", wenn Leistungen hinzugefügt werden: Zeile 91 und 95 in `client/student/src/components/externalModules.tsx`
    - Bereich "Modulnummer", wenn Leistungen hinzugefügt werden: Zeile 118 und 122 in `client/student/src/components/externalModules.tsx`
    - Bereich "Hier ... angeben", wenn z.B. das Nebenfach oder der nicht-mathematische Vertiefungsbereich angegeben werden soll: Zeile 34 und 50 in `client/student/src/components/minorSubjectEtcTextFields.tsx`
- die Beschreibungen der einzelnen Eigenschaften eines Prüfungsplans wie z.B.  'Diese Anzahl an CP muss minimal erbracht werden in diesem Bereich: ' in `client/student/src/components/descriptions.ts`
- die Variable `needsNoButtonToAddExternalModules` in Zeile 17 in `client/student/src/components/externalModules.tsx` enthält die Namen der Bereiche, in denen es keinen Button bzw. keine Möglichkeit zum Hinzufügen von Leistungen gibt (der Name des Bereichs muss genauso angegeben werden wie er in der Prüfungsordnung steht inklusive Groß-/Kleinschreibung etc.)
- die Variable `needsAdditionalInputFieldForName` in Zeile 6 in `client/student/src/components/minorSubjectEtcTextFields.tsx` enthält die Namen der Bereiche, in denen es ein extra Eingabefeld geben soll z.B. für den Namen des Nebenfachs (der Name des Bereichs muss genauso angegeben werden wie er in der Prüfungsordnung steht inklusive Groß-/Kleinschreibung etc.)

Zur Prüfungsplan-Eingabemaske ist ebenfalls zu beachten, dass, wenn bei der Eingabe der Prüfungsordnung Markdown-Syntax für Links verwendet wird (z.B. `[www.mathematik.tu-darmstadt.de/nebenfach](https://www.mathematik.tu-darmstadt.de/nebenfach)`), die Studierenden die Links in der Prüfungsplan-Eingabemaske direkt anklicken können.

