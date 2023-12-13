/**
 * @author Tarik Azzouzi
 */
import { useRef, useEffect } from 'react';
import schema from '../assets/examinationregulation.schema.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
/**
 * @typedef {import('./selectEditorExtend.js').SelectedExtend} SelectedExtend
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* 
    Reason for deactivating rule: The JSONEditor library does not provide type definitions
    and the library is too big for manual typing
*/

/**
 * A utility function that extends the JSONEditor Select2 editor.
 * @function
 * @async
 * @returns {Promise<SelectedExtend>} A promise that resolves to the extended Select2 editor module.
 * @see {@link module:selectEditorExtend.SelectedExtend}
 */
async function getSelectEditorExtend() {
  // Import SelectEditorExtended after setting window.JSONEditor
  return await import('./selectEditorExtend.js').then((module) => {
    window.JSONEditor.defaults.editors.select2 = module.SelectedExtend;
    return module.SelectedExtend;
  });
}

/**
 * Initializes the JSON Editor on a given DOM element.
 * @function
 * @async
 * @param {React.MutableRefObject<null | HTMLDivElement>} ref - Ref for the DOM element used by the JSON Editor.
 * @description This function initializes the JSON Editor on a specified DOM element.
 */
async function initializeJsonEditor(
  ref: React.MutableRefObject<null | HTMLDivElement>
) {
  if (ref.current) {
    await getSelectEditorExtend();

    /**
     * Represents an instance of the JSON Editor.
     * @type {any}
     */
    const editor = new window.JSONEditor(ref.current, {
      theme: 'bootstrap5',
      iconlib: 'fontawesome4',
      schema: schema,
      ajax: true
    });

    // Watch for changes in the editor
    watchEditorChanges(editor);
  }
}

/**
 * @description Watches for changes in the JSON Editor and triggers a callback.
 * @function
 * @param {any} editor - The JSON Editor instance.
 */
function watchEditorChanges(editor: any) {
  /**
   * Callback function to be executed on editor changes.
   * @param {string} path - The path of the changed element.
   */
  const watcherCallback = function (path: string) {
    try {
      // Use regex to extract information from the changed path
      const regex = /^([^]+)\.module\.(\d+)\.name$/;
      const match = path.match(regex);

      if (match) {
        // Build the result path and set a specific value in the editor
        const resultString =
          match[1] + '.module' + '.' + match[2] + '.creditPoints';

        // Will be used for maping, set CP field to coressponding module credit points if new module selected
        /** @todo: This is a temporary test solution, needs to be changed*/
        editor.getEditor(resultString).setValue(9);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Watch for changes in the entire editor
  editor.on('change', () => {
    // Iterate through all editor keys and set up watches
    for (const key in editor.editors) {
      if (
        Object.prototype.hasOwnProperty.call(editor.editors, key) &&
        key !== 'root'
      ) {
        // Unwatch and re-watch each key to ensure callback is triggered
        editor.unwatch(key, watcherCallback.bind(editor, key));
        editor.watch(key, watcherCallback.bind(editor, key));
      }
    }
  });
}

/**
 * @description The component representing the Examination Regulation App.
 * @function
 * @returns {JSX.Element} JSX element representing the Examination Regulation App.
 */
function ExaminationRegulationApp() {
  /**
   * A ref for the DOM element used by the JSON Editor.
   * @type {React.MutableRefObject<null|HTMLDivElement>}
   */
  const editorRef = useRef<HTMLDivElement | null>(null);

  /**
   * Effect hook for initializing the JSON Editor.
   */
  useEffect(() => {
    initializeJsonEditor(editorRef);
  }, []);

  // Render a div element and assign the ref
  return (
    <>
      <div ref={editorRef} />
    </>
  );
}

/**
 * Renders the `ExaminationRegulationApp` component without strict mode.
 * @function
 * @returns {JSX.Element} JSX element representing the app without strict mode.
 */
const AppWithoutStrictMode = () => <ExaminationRegulationApp />;

// Declaration to extend the global Window interface with JSONEditor property
declare global {
  interface Window {
    JSONEditor: any;
  }
}

// Export the `AppWithoutStrictMode` component for use in other files
export default AppWithoutStrictMode;
