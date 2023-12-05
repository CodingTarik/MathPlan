import { useRef, useEffect} from 'react';
//@ts-expect-error json-editor is not typed
import * as jsonmod from '@json-editor/json-editor';
import schema from '../assets/examinationregulation.schema.json';

// Die Komponente "ExaminationRegulationApp"
function ExaminationRegulationApp() {
  // Ein Ref für das DOM-Element, das vom JSON-Editor verwendet wird
  const editorRef = useRef<HTMLDivElement | null>(null);
  // Effekt-Hook für die Initialisierung des JSON-Editors
  useEffect(() => {
      console.log('i fire once');
      // Prüfe, ob das Ref ein gültiges DOM-Element enthält
      if (editorRef.current) {
        // Initialisiere den JSON-Editor mit dem DOM-Element und dem Schema
        const editor: JSONEditor<HTMLDivElement> = new jsonmod.JSONEditor(
          editorRef.current,
          {
            theme: 'bootstrap5',
            iconlib: "fontawesome4",
            schema: schema
          }
        );
        editor
    }
  }, []); // Das leere Abhängigkeitsarray stellt sicher, dass der Effekt nur einmal ausgeführt wird

  // Die Komponente rendert ein div-Element und weist ihm das Ref zu
  return <div ref={editorRef} />;
}

// Hier wird die Komponente ohne Striktmodus gerendert
const AppWithoutStrictMode = () => <ExaminationRegulationApp />;

// Exportiere die AppWithoutStrictMode-Komponente für die Verwendung in anderen Dateien
export default AppWithoutStrictMode;
