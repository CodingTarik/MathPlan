const fs = require('fs');
const pdf = require('pdf-parse');

Modulhandbuch= 'ModulhandbuchPO2018_neu_und_schn_Stand_15_Dez_21.pdf'
SuchWorte = ['Modul Nr.', 'Modulname', 'Creditpoints', 'Sprache', 'Verwendbarkeit des Moduls']; //wir müssten die Funktionalität zu Suchwort Sequenz verändern
keyWordBis = ['Creditpoints','Modul','Arbeitsaufwand','Modulverantwortliche','9']

// Pfad zur PDF-Datei
const pdfFilePath = 'ModulhandbuchPO2018_neu_und_schn_Stand_15_Dez_21.pdf'
let fullpdfText;
// Funktion zum Lesen und Filtern des PDF-Inhalts
async function readAndFilterPDF(pdfFilePath, searchTerm) {
  try {
    // Lese den Inhalt der PDF-Datei
    const dataBuffer = fs.readFileSync(pdfFilePath);
    const data = await pdf(dataBuffer);

    // Extrahiere den Text aus der PDF
    const pdfText = data.text;

    // Filtere den Text nach dem Suchbegriff
    const filteredText = pdfText.includes(searchTerm) ? pdfText : 'Suchbegriff nicht gefunden';
    
    //Filtere die entscheidenden Wörter heraus:
    //for(let i =0; i< searchTerm.length; i++){

    let filterd= filterAndAppendNextWords(pdfText, SuchWorte[1],keyWordBis[1])
    console.log(filterd)
    //}


    // Gib das Ergebnis aus
    //console.log(filteredText);
    //fullpdfText= this.pdfText;
    //console.log(filterd)
  
  } catch (error) {
    console.error('Fehler beim Lesen der PDF-Datei:', error);
  }
  
}

// Aufruf //
const searchTerm = 'Modulhandbuch';
readAndFilterPDF(pdfFilePath, searchTerm);



/**
 * 
 * @param {*} originalString 
 * @param {*} searchTerm 
 * @param {*} keyWordBis 
 * @returns Das Suchwort angehängt mit allen Wörtern, bis zum @keyWordBis, das ist nicht mehr in der Rückgabe.
 */
function filterAndAppendNextWords(originalString, searchTerm,keyWordBis) {
    const words = originalString.split(/\s+/); // Teile den String in Wörter auf
    const results = [];
  
    for (let i = 0; i < words.length; i++) {
      if (words[i] === searchTerm && i + 1 < words.length) {
        
        // Wenn das Suchwort gefunden wurde und es genügend Wörter danach gibt
        ///////const nextWord = words[i + 1];

        //mehr wörter anhängen:
        let tmp = words[i];
        for( let j=1; words[i+j]!=keyWordBis; j++){
          tmp+=' '+ words[i+j]
        }
       
        results.push(tmp);//Modulname' '+ nextWord);// +' '+ nextNextWord+' '+ next4Word+' '+ next5Word);
      }
    }
  
    if (results.length === 0) {
      return "Suchwort nicht gefunden.";
    }
  
    return results;
  }

