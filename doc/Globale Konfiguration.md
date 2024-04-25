# Globale Konfiguration von MathPlan anpassen

Mithilfe der Datei ".env", die sich im obersten Verzeichnis des Projekts befindet, können grundlegende Einstellungen für MathPlan vorgenommen werden.

Zum Ändern der Konfiguration gehen Sie bitte wie folgt vor:
1. Stoppen Sie _MathPlan_, sofern die Anwendung gerade ausgeführt ist. Läuft die Anwendung lokal auf Ihrem Rechner, können Sie den Prozess beenden, indem Sie das Terminal-Fenster schließen oder die Tastenkombination `Strg` + `C` drücken.
2. Öffnen Sie die Datei ".env" in einem Texteditor Ihrer Wahl und passen Sie die gewünschten Einstellungen an.
3. Speichern Sie die Datei. Beim nächsten Start von _MathPlan_ werden die neuen Einstellungen übernommen.

## Konfigurationsoptionen

Jede Einstellung besteht aus einem Namen und einem Wert, die durch ein Gleichheitszeichen getrennt sind: `NAME='WERT'`. Die Werte sind in der Regel Zeichenketten, die bestimmte Anforderungen erfüllen müssen.
In der Datei sind die folgenden Einstellungen verfügbar:

## Entwicklungs- und Test-Einstellungen

### `DEVELOPMENT_MODE`
**Erlaubte Werte**: `true`, `false`

Gibt an, ob _MathPlan_ im Entwicklungsmodus ausgeführt wird. Im Entwicklungsmodus wird der Login über den Single-Sign-On-Dienst deaktiviert. Dies ist sinnvoll, wenn Sie _MathPlan_ lokal auf Ihrem Rechner ausführen.

### `DEBUG`
**Erlaubte Werte**: `true`, `false`

Aktiviert oder deaktiviert die Ausgabe von Debug-Informationen in der Konsole. Wenn Sie Probleme mit _MathPlan_ haben, kann es hilfreich sein, diese Option zu aktivieren, um mehr Informationen über den Fehler zu erhalten.

## Webserver-Verbindung

Hier wird konfiguriert, wie _MathPlan_ über das Internet erreichbar ist. Sofern _MathPlan_ nicht direkt von außen erreichbar ist oder nur lokal ausgeführt wird, ist eine sichere Verbindung über HTTPS im Allgemeinen nicht zwingend erforderlich.

### `HOST`
**Erlaubte Werte**: IP-Adresse, Domainname

Die IP-Adresse oder der Domainname, unter der/dem _MathPlan_ erreichbar ist. Diese Einstellung wird zum aktuellen Zeitpunkt nur für Debug-Ausgaben verwendet und hat keinen we iterenEinfluss auf die Funktionalität von _MathPlan_.

### `ALLOW_HTTPS`
**Erlaubte Werte**: `true`, `false`

Gibt an, ob _MathPlan_ über eine sichere HTTPS-Verbindung erreichbar sein soll.

### `PORT_HTTPS`
**Erlaubte Werte**: Ganze Zahlen zwischen 1 und 65535

Der Port, auf dem _MathPlan_ über HTTPS erreichbar ist.

### `CERT_PATH`
**Erlaubte Werte**: Dateipfad

Der Dateipfad zur Zertifikatsdatei, die für die HTTPS-Verbindung verwendet wird.

### `CERT_SECRET_PATH`
**Erlaubte Werte**: Dateipfad

Der Dateipfad zur Geheimdatei, die für die HTTPS-Verbindung verwendet wird.

### `ALLOW_HTTP`
**Erlaubte Werte**: `true`, `false`

Gibt an, ob _MathPlan_ über eine ungesicherte HTTP-Verbindung erreichbar sein soll.

### `PORT_HTTP`
**Erlaubte Werte**: Ganze Zahlen zwischen 1 und 65535

Der Port, auf dem _MathPlan_ über HTTP erreichbar ist.

### `HTTP_REDIRECT`
**Erlaubte Werte**: `true`, `false`

Gibt an, ob Anfragen an den HTTP-Port auf den HTTPS-Port umgeleitet werden sollen. Dies ist sinnvoll, um sicherzustellen, dass alle Anfragen über eine sichere Verbindung erfolgen, sofern _MathPlan_ direkt von außen erreichbar ist.

## Datenbankverbindung

Hier wird konfiguriert, wie _MathPlan_ auf die Datenbank zugreift. Die Datenbank wird für die Speicherung von Benutzerdaten, Modulinformationen, Prüfungsplänen und anderen Daten verwendet.

### `DB_DIALECT`
**Erlaubte Werte**: `mysql`, `sqlite`

Der Datenbanktyp, der für _MathPlan_ verwendet wird. Derzeit werden die Datenbanken MySQL und SQLite unterstützt.

### `DB_HOST`
**Erlaubte Werte**: IP-Adresse, Domainname

Die IP-Adresse oder der Domainname des Datenbankservers.

### `DB_USER`
**Erlaubte Werte**: Zeichenkette

Der Benutzername, mit dem _MathPlan_ auf die Datenbank zugreift. Dieser Benutzer muss die erforderlichen Berechtigungen haben, um Daten in der Datenbank zu lesen und zu schreiben sowie Tabellen zu erstellen und zu löschen, sofern die von _MathPlan_ benötigten Tabellen nicht bereits vorhanden sind.

### `DB_PASSWORD`
**Erlaubte Werte**: Zeichenkette

Das Passwort, mit dem _MathPlan_ auf die Datenbank zugreift.

### `DB_DATABASE`
**Erlaubte Werte**: Zeichenkette

Der Name der Datenbank, in der die Daten gespeichert werden. Diese Datenbank muss bereits existieren.

### `MAX_NUMBER_FOUND_MODULES`
**Erlaubte Werte**: Ganze Zahlen

Die maximale Anzahl von Modulen, die in einer Anfrage an im internen Verwaltungsmenü im Bereich "Modulverwaltung" zurückgegeben werden. Wenn die Anzahl der gefundenen Module größer ist als dieser Wert, wird eine Warnung ausgegeben und es wird kein Ergebnis zurückgegeben.


## Einstellungen zur Website

Hier wird konfiguriert, wie _MathPlan_ auf der Website aussieht und wie sie sich verhält.

### `DEFAULT_LANGUAGE`
**Erlaubte Werte**: `de`, `en`

Die Standardsprache, die auf der Website verwendet wird. Diese Einstellung bestimmt, welche Sprache standardmäßig angezeigt wird, wenn der Benutzer die Website zum ersten Mal besucht.
**Hinweis:** Diese Funktion wurde bisher noch nicht implementiert, die Einstellung hat also keine Auswirkung.

### `PAGE_NAME`
**Erlaubte Werte**: Zeichenkette

Der Name der Website, der in der Titelleiste des Browsers und auf der Startseite angezeigt wird.

### `FAQ_STARTPAGE_ACTIVE`
**Erlaubte Werte**: `true`, `false`

Gibt an, ob ein FAQ-Bereich direkt auf der Startseite angezeigt werden soll. Die Fragen und Antworten hierzu werden direkt innerhalb von _MathPlan_ in der Datei `views/pages/startpage.ejs` definiert.

### `FAQ_URL_ACTIVE`
**Erlaubte Werte**: `true`, `false`

Gibt an, ob im Footer der Seite ein Link zu einer externen FAQ-Seite angezeigt werden soll.

### `FAQ_URL`
**Erlaubte Werte**: URL

Die URL zur externen FAQ-Seite, die im Footer der Seite angezeigt wird, sofern `FAQ_URL_ACTIVE` auf `true` gesetzt ist.

### `SUPPORT_RESPONSIBLE`
**Erlaubte Werte**: Zeichenkette

Der Name der Person oder Abteilung, die für den Support von _MathPlan_ zuständig ist. Diese Information im Footer über den Kontaktmöglichkeiten angezeigt.

### `SUPPORT_EMAIL_ACTIVE`
**Erlaubte Werte**: `true`, `false`

Gibt an, ob eine E-Mail-Adresse für den Support von _MathPlan_ angezeigt werden soll.

### `SUPPORT_EMAIL`
**Erlaubte Werte**: E-Mail-Adresse

Die E-Mail-Adresse, an die Anfragen zum Support von _MathPlan_ gesendet werden können. Diese wird im Footer angezeigt, sofern `SUPPORT_EMAIL_ACTIVE` auf `true` gesetzt ist.

### `SUPPORT_LINK_ACTIVE`
**Erlaubte Werte**: `true`, `false`

Gibt an, ob ein Link zu einer externen Support-Seite, etwa einem Kontaktformular, angezeigt werden soll.

### `SUPPORT_LINK`
**Erlaubte Werte**: URL

Die URL zur externen Support-Seite, die im Footer angezeigt wird, sofern `SUPPORT_LINK_ACTIVE` auf `true` gesetzt ist.

### `IMPRINT_URL`
**Erlaubte Werte**: URL

Die URL zum Impressum von _MathPlan_. Diese wird im Footer angezeigt.

### `PRIVACY_POLICY_URL`
**Erlaubte Werte**: URL

Die URL zur Datenschutzerklärung von _MathPlan_. Diese wird im Footer angezeigt.

### `SOCIAL_MEDIA_ACTIVE`
**Erlaubte Werte**: `true`, `false`

Gibt an, ob Links zu sozialen Medien im Footer angezeigt werden sollen.

### `INSTAGRAM_URL`, `FACEBOOK_URL`, `TWITTER_URL`
**Erlaubte Werte**: URL

Die URLs zu den sozialen Medien, die im Footer angezeigt werden, sofern `SOCIAL_MEDIA_ACTIVE` auf `true` gesetzt ist.
