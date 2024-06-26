# Konfiguration des Modulbeschreibungsparsers (deutsch)
[English version below](#configuring-the-module-description-parser-english)

Mithilfe des Modulbeschreibungsparsers können aus den Modulhandbüchern der TU Darmstadt die für _MathPlan_ relevanten Informationen zu extrahieren.

Grundsätzliches Vorgehen des Parsers:
1. Das PDF-Modulhandbuch wird in Plaintext umgewandelt.
2. Der Plaintext wird vorverarbeitet. Hier werden etwa Zeilenumbrüche und unnötige Leerzeichen entfernt.
3. Über jeder Modulbeschreibung steht normalerweise ein Titel. Anhand dessen wird der Plaintext in Abschnitte unterteilt, die jeweils eine Modulbeschreibung enthalten.
4. Aus jedem Abschnitt werden die relevanten Informationen extrahiert. Diese befinden sich in der Regel zwischen zwei bestimmten Stichwörtern - der Text zwischen diesen Stichwörtern wird extrahiert. Danach sind ggf. weitere Suchen-und-Ersetzen-Operationen notwendig, um die Informationen zu bereinigen.

Die Suchen-und-Ersetzen-Operationen werden mithilfe von regulären Ausdrücken durchgeführt. Reguläre Ausdrücke bieten eine mächtige Möglichkeit, Texte zu durchsuchen und zu bearbeiten und sind in `JavaScript` nativ unterstützt. Sie können jedoch auch sehr komplex werden, insbesondere wenn sie auf spezifische Texte in einem PDF-Dokument angewendet werden. Für weiterführende Informationen über reguläre Ausdrücke in JavaScript verweisen wir auf Online-Informationen. Einen guten Anhaltspunkt bieten etwa die [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions). Ein Cheatsheet für reguläre Ausrücke und eine einfache Möglichkeit, reguläre Ausdrücke anhand von Beispielen zu testen, bietet [regexr.com](https://regexr.com/).

Da nicht jedes Modulhandbuch an der TU Darmstadt gleich aussieht, ist es notwendig, den Parser individuell anzupassen. Dazu wird eine Konfigurationsdatei verwendet, die die notwendigen Informationen für den Parser enthält:

## Aufbau der Konfigurationsdatei

Die Konfigurationsdatei ist nach dem JSON-Format aufgebaut. Weitere Informationen über JSON finden sich etwa auf [json.org](https://www.json.org/json-de.html).

Beispiel des Grundaufbaus:
```json
{
  "enableDefaultPreprocessing": true,
  "additionalPreprocessing": [
    {
      "find": "Leistungspun kte",
      "flags": "g",
      "replace": "Leistungspunkte"
    }
  ],
  "moduleTitle": "Modulbeschreibung",

  "moduleProperties": []
}
```

## Globale Einstellungen

- **enableDefaultPreprocessing** (boolean). Gibt an, ob die Standardvorverarbeitung aktiviert sein soll. Diese entfernt etwa Zeilenumbrüche und unnötige Leerzeichen.
- **additionalPreprocessing** (array). Enthält zusätzliche Vorverarbeitungsschritte. Die Schritte werden von oben nach unten ausgeführt. Jeder Schritt ist ein Objekt mit den folgenden Eigenschaften:
    - **find** (string). Regulärer Ausdruck für den zu ersetzenden Text.
    - **flags** (string). Die Flags des regulären Ausdrucks.
    - **replace** (string). Der Ersatztext.
- **moduleTitle** (string). Der Titel, der über jeder Modulbeschreibung steht. Dieser wird verwendet, um den Plaintext in Abschnitte zu unterteilen.

**Hinweis:** Bei der Eingabe von regulären Ausdrücken ist darauf zu achten, dass die Backslashes doppelt geschrieben werden müssen, da sie in JSON-Strings als Escape-Zeichen verwendet werden.

**Hinweis:** Die Einstellungen `enableDefaultPreprocessing`, `additionalPreprocessing` und `moduleTitle` sind auf jeden Fall erforderlich. Wenn sie fehlen, wird der Parser nicht funktionieren. Das `additionalPreprocessing`-Array kann jedoch leer sein.

## Modulbeschreibungen

Das Array **moduleProperties** enthält die Konfigurationen für die Extraktion der einzelnen Eigenschaften aus den Modulbeschreibungen. Jede Konfiguration ist ein Objekt.

Beispiel:
```json
{
  "propertyName": "moduleLanguage",
  "readFrom": "Modulname",
  "readTo": "Modulverantwortliche Person",
  "keepReadFromAndTo": false,
  "useResultAtIndex": 0,
  "postprocessing": [
    {
      "find": ".*Sprache\\s*",
      "flags": "g",
      "replace": ""
    }
  ],
  "plausibilityCheck": "^([Ee]nglisch|[Dd]eutsch).*"
}
```

- **propertyName** (string). Der interne Name der Eigenschaft, die extrahiert werden soll. Pro erkanntem Modul gibt der Parser ein Objekt zurück. Der interne Name wird als Schlüssel in diesem Objekt verwendet.
- **readFrom** (string). Regulärer Ausdruck für den Text, der unmittelbar vor der zu extrahierenden Information steht bzw. mit dem die zu extrahierende Information beginnt.
- **readTo** (string). Regulärer Ausdruck für den Text, der unmittelbar nach der zu extrahierenden Information steht bzw. mit dem die zu extrahierende Information endet.
- **keepReadFromAndTo** (boolean). Wenn true, werden die Stichwörter, die durch **readFrom** und **readTo** definiert sind, in das Ergebnis mit einbezogen; wenn false, werden sie entfernt.
- **useResultAtIndex** (number). Möglicherweise werden mehrere Vorkommnisse von "readFrom ... readTo" gefunden. Dieser Wert gibt an, welches Ergebnis verwendet werden soll. 0 bedeutet das erste Ergebnis, 1 das zweite usw.
- **postprocessing** (array). Enthält zusätzliche Suchen-und-Ersetzen-Operationen, die auf das Ergebnis angewendet werden. Die Operationen werden von oben nach unten ausgeführt. Jeder Schritt ist ein Objekt mit den folgenden Eigenschaften:
    - **find** (string). Regulärer Ausdruck für den zu ersetzenden Text.
    - **flags** (string). Die Flags des regulären Ausdrucks.
    - **replace** (string). Der Ersatztext.
- **plausibilityCheck** (string). Regulärer Ausdruck, der auf das Ergebnis angewendet wird und die auf das Ergebnis zutreffen sollte. Dies hilft dem Parser, das Ergebnis zu überprüfen und ggf. zu verwerfen, wenn es nicht den Erwartungen entspricht. Diese Eigenschaft ist **optional**, wenn es keine sinnvolle Plausibilitätsprüfung gibt, kann sie weggelassen werden.

**Hinweis:** Die Eigenschaften `propertyName`, `readFrom`, `readTo`, `keepReadFromAndTo`, `useResultAtIndex` und `postprocessing` sind auf jeden Fall erforderlich. Wenn sie fehlen, wird der Parser nicht funktionieren. Das `postprocessing`-Array kann jedoch leer sein.

## Neue Konfigurationsdateien entwickeln und testen

Um eine vorhandene Konfigurationsdatei in Verbindung mit einem bestimmten Modulhandbuch zu testen, kann "moduleDescriptionParserCLI.js" verwendet werden. Dieses kleine Skript führt den Parser in der Konsole aus und gibt die Ergebnisse direkt aus:

```
node moduleDescriptionParserCLI.js <Pfad zur PDF-Datei> <Pfad zur Konfigurationsdatei>
```

Um sinnvolle Werte für readFrom, readTo und das Postprocessing zu finden, kann es hilfreich sein, den rohen Text der PDF-Datei genauer zu untersuchen. Mithilfe des Arguments "--raw" führt der Modulbeschreibungsparser lediglich das Preprocessing durch und teilt den resultierenden Text in je einen Abschnitt pro Modul auf. In der Konfigurationsdatei sind dabei nur die globalen Einstellungen relevant, der Rest wird ignoriert.

```
node moduleDescriptionParserCLI.js <Pfad zur PDF-Datei> <Pfad zur Konfigurationsdatei> --raw
```

## Derzeit verfügbare Konfigurationsdateien

- `PO2018 neu und schoen.json`: Für das [Modulhandbuch Mathematik PO 2018](https://www.mathematik.tu-darmstadt.de/media/mathematik/studium/downloads_1/studienordnungen_modulhandbuecher_etc/modulhandbuch/Modulhandbuch_neu_und_schoen_Stand_Nov_2023_midi_Inhaltsverzeichnis.pdf). Dieses Modulhandbuch wurde wohl stark angepasst, sodass einige Keywords anders sind als in solchen Modulhandbüchern, die direkt von TUCaN erstellt wurden.
- `TUCaN-Standardformat.json` Für Modulhandbücher, die direkt mit TUCaN erstellt wurden.
- `TUCaN-Standardformat (keywords only).json` Für Modulhandbücher, die direkt mit TUCaN erstellt wurden. Da es in diesen Modulhandbüchern oft ungünstige Seitenumbrüche gibt, die das Auslesen stark erschweren, enthält die Datei `TUCaN-Standardformat.json` teilweise ziemlich komplexe reguläre Ausdrücke. `TUCaN-Standardformat (keywords only).json` ist simpler aufgebaut und sollte daher besser zu verstehen sein. Diese Konfiguration liefert allerdings schlechtere Ergebnisse als `TUCaN-Standardformat.json`.
- `TUCaN-Standardformat englisch.json` Für _englische_ Modulhandbücher, die direkt mit TUCaN erstellt wurden.

# Configuring the module description parser (English)

The module description parser can be used to extract the information relevant for _MathPlan_ from the TU Darmstadt module handbooks.

Basic procedure of the parser:
1. The PDF module handbook is converted into plain text.
2. The plain text is preprocessed. For example, line breaks and unnecessary spaces are removed.
3. A title is normally placed above each module description. This title is used to divide the plain text into sections, each of which contains a module description.
4. The relevant information is extracted from each section. This is usually located between two specific keywords - the text between these keywords is extracted. Further search-and-replace operations may then be necessary to clean up the information.

Since not every module handbook at TU Darmstadt looks the same, it is necessary to adapt the parser individually. For this purpose, a configuration file is used, which contains the necessary information for the parser:

## Structure of the configuration file

Example:
```json
{
  "enableDefaultPreprocessing": true,
  "additionalPreprocessing": [
    {
      "find": "Leistungpun kte",
      "flags": "g",
      "replace": "Leistungspunkte"
    }
  ],
  "moduleTitle": "Modulbeschreibung",

  "moduleProperties": []
}
```

## Global settings

- **enableDefaultPreprocessing** (boolean). Specifies whether the default preprocessing should be enabled. This removes line breaks and unnecessary spaces, for example.
- **additionalPreprocessing** (array). Contains additional preprocessing steps. The steps are executed from top to bottom. Each step is an object with the following properties:
    - **find** (string). Regular expression for the text to be replaced.
    - **flags** (string). The flags of the regular expression.
    - **replace** (string). The replacement text.
- **moduleTitle** (string). The title that appears above each module description. This is used to divide the plain text into one section per module.

**Note:** When entering regular expressions, it is important to note that backslashes must be written twice, as they are used as escape characters in JSON strings.

## Module descriptions

The array **moduleProperties** contains the configurations for the extraction of the individual properties from the module descriptions. Each configuration is an object.

Example:
```json
{
  "propertyName": "moduleLanguage",
  "readFrom": "Modulname",
  "readTo": "Modulverantwortliche Person",
  "keepReadFromAndTo": false,
  "useResultAtIndex": 0,
  "postprocessing": [
    {
      "find": ".*Sprache\\s*",
      "flags": "g",
      "replace": ""
    }
  ],
  "plausibilityCheck": "^([Ee]nglisch|[Dd]eutsch).*"
}
```

- **propertyName** (string). The internal name of the property to be extracted. For each detected module, the parser returns an object. The internal name is used as a property of this object.
- **readFrom** (string). Regular expression for the text that immediately precedes the information to be extracted or with which the information to be extracted begins.
- **readTo** (string). Regular expression for the text that immediately follows the information to be extracted or with which the information to be extracted ends.
- **keepReadFromAndTo** (boolean). If true, the keywords defined by **readFrom** and **readTo** are included in the result; if false, they are removed.
- **useResultAtIndex** (number). Multiple occurrences of "readFrom ... readTo" may be found. This value indicates which result should be used. 0 means the first result, 1 means the second, and so on.
- **postprocessing** (array). Contains additional search-and-replace operations to be applied to the result. The operations are executed from top to bottom. Each step is an object with the following properties:
    - **find** (string). Regular expression for the text to be replaced.
    - **flags** (string). The flags of the regular expression.
    - **replace** (string). The replacement text.
- **plausibilityCheck** (string). Regular expression applied to the result that the result should match with. This helps the parser to check the result and discard it if it does not meet expectations. This property is **optional**; if there is no meaningful plausibility check, it can be omitted.

## Developing and testing new configuration files

To test an existing configuration file in conjunction with a specific module handbook, "moduleDescriptionParserCLI.js" can be used. This small script runs the parser in the console and outputs the results directly:

```
node moduleDescriptionParserCLI.js <path to the PDF file> <path to the configuration file>
```

To find good values for readFrom, readTo, and postprocessing, it may be helpful to examine the raw text of the PDF file more closely. Using the "--raw" argument, the module description parser only performs the preprocessing and divides the resulting text into one section per module. In this case, only the global settings in the configuration file are relevant and the rest is ignored.

```
node moduleDescriptionParserCLI.js <path to the PDF file> <path to the configuration file> --raw
```

## Currently available configuration files

- `PO2018 neu und schoen.json`: For the [Mathematics PO 2018 module handbook](https://www.mathematik.tu-darmstadt.de/media/mathematik/studium/downloads_1/studienordnungen_modulhandbuecher_etc/modulhandbuch/Modulhandbuch_neu_und_schoen_Stand_Nov_2023_midi_Inhaltsverzeichnis.pdf). This module handbook has apparently been heavily modified, so some keywords are different from those in module handbooks created directly by TUCaN.
- `TUCaN-Standardformat.json` For module handbooks created directly with TUCaN.
- `TUCaN-Standardformat (keywords only).json` For module handbooks created directly with TUCaN. Since these module handbooks often have unfavorable page breaks that make parsing them perfectly very difficult, the file `TUCaN-Standardformat.json` contains some quite complex regular expressions. `TUCaN-Standardformat (keywords only).json` is simpler and should therefore be easier to understand. However, this configuration provides worse results than `TUCaN-Standardformat.json`.
- `TUCaN-Standardformat englisch.json` For _English_ module handbooks created directly with TUCaN.
