import { useRef, useEffect } from 'react';
import schema from '../assets/examinationregulation.schema.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* Reason for deactivating rule: The JSONEditor library does not provide type definitions
    and the libary is very big */
function getSelectEditorExtend() {
  // Import von SelectEditorExtended nach dem Setzen von window.JSONEditor
  import('./selectEditorExtend.js').then((module) => {
    window.JSONEditor.defaults.editors.select2 = module.SelectedExtend;
    return module.SelectedExtend;
  });
}

// Die Komponente "ExaminationRegulationApp"
function ExaminationRegulationApp() {
  // Ein Ref für das DOM-Element, das vom JSON-Editor verwendet wird
  const editorRef = useRef<HTMLDivElement | null>(null);
  // Effekt-Hook für die Initialisierung des JSON-Editors
  useEffect(() => {
    // Prüfe, ob das Ref ein gültiges DOM-Element enthält
    //jsonmod.JSONEditor.plugins.select2.width = '300px';
    //jsonmod.JSONEditor.plugins.select2.enable = true;
    if (editorRef.current) {
      // Initialisiere den JSON-Editor mit dem DOM-Element und dem Schema
      getSelectEditorExtend();

      const editor: any = new window.JSONEditor(editorRef.current, {
        theme: 'bootstrap5',
        iconlib: 'fontawesome4',
        schema: schema,
        ajax: true
      });

      //console.log(editor);
      //editor.editors.select = SelectEditorExtended;
      const watcherCallback = function (path: any) {
        try {
          /*console.log(
            `field with path: [${path}] changed to [${JSON.stringify(
              editor.getEditor(path).getValue()
            )}]`
          );*/
          // matching paths like [root.area.module.0.name] or [root.area.module.1.name] or [root.area.aea.module.2.name] or [boot.area.addgsgds.fdsgfdsg.fgsdfg.module.3.name]
          const regex = /^([^]+)\.module\.(\d+)\.name$/;
          const match = path.match(regex);
          //console.log('nice');
          if (match) {
            //console.log(match[0]);
            const resultString =
              match[1] + '.module' + '.' + match[2] + '.creditPoints';
            editor.getEditor(resultString).setValue(9);
          }
        } catch (e) {
          console.log(e);
        }
      };
      editor.on('change', () => {
        for (const key in editor.editors) {
          //console.log(key);
          //if (editor.editors.hasOwnProperty(key) && key !== 'root')
          if (Object.prototype.hasOwnProperty.call(editor.editors, key) && key !== 'root') {
            editor.unwatch(key, watcherCallback.bind(editor, key));
            editor.watch(key, watcherCallback.bind(editor, key));
          }
        }
      });
      //console.log(editor);
    }
  }, []); // Das leere Abhängigkeitsarray stellt sicher, dass der Effekt nur einmal ausgeführt wird
  // Die Komponente rendert ein div-Element und weist ihm das Ref zu
  return (
    <>
      <div ref={editorRef} />
    </>
  );
}

// Hier wird die Komponente ohne Striktmodus gerendert
const AppWithoutStrictMode = () => <ExaminationRegulationApp />;

declare global {
  interface Window {
    JSONEditor: any;
  }
}

// Exportiere die AppWithoutStrictMode-Komponente für die Verwendung in anderen Dateien
export default AppWithoutStrictMode;
