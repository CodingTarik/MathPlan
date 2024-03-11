// Import the schema for the examination regulation from a JSON file.
import schema from '../assets/examinationregulation.schema.json';

// Import the function to save the examination regulation to the database.
import { saveExamRegulationFunction } from '../database_services/ExamRegulationService.ts';

/**
 * @async
 * @function getSelectEditorExtend
 * @description This function imports the select editor extension for the JSON editor.
 * @returns {Promise<any>} The select editor extension.
 */
export async function getSelectEditorExtend() {
  // Import the select editor extension and set it as the default select editor for the JSON editor.
  return await import('./selectEditorExtend.js').then((module) => {
    window.JSONEditor.defaults.editors.select2 = module.SelectedExtend;
    return module.SelectedExtend;
  });
}

/**
 * @async
 * @function saveExamRegulation
 * @description This function gets the current value of the examination regulation from the JSON editor and saves it to the database.
 * @param {string} internalName - The internal name of the examination regulation.
 * @returns {Promise<boolean>} Whether the save was successful.
 */
export async function saveExamRegulation(
  internalName: string
): Promise<boolean> {
  // Get the current value of the examination regulation from the JSON editor.
  const examValue = window.JSONEditorInstance.getValue();

  // Save the examination regulation to the database.
  return saveExamRegulationFunction(examValue, internalName);
}

/**
 * @async
 * @function initializeJsonEditor
 * @description This function initializes the JSON editor with the examination regulation schema and sets up the watcher for changes.
 * @param {React.MutableRefObject<null | HTMLDivElement>} ref - The reference to the div that will contain the JSON editor.
 */
export async function initializeJsonEditor(
  ref: React.MutableRefObject<null | HTMLDivElement>
) {
  // Check if the reference is current.
  if (ref.current) {
    // Get the select editor extension.
    await getSelectEditorExtend();

    // Initialize the JSON editor with the examination regulation schema.
    const editor = new window.JSONEditor(ref.current, {
      theme: 'bootstrap5',
      iconlib: 'fontawesome4',
      schema: schema,
      no_additional_properties: true,
      ajax: true
    });

    // Set the JSON editor instance on the window object.
    window.JSONEditorInstance = editor;

    // Set up the watcher for changes in the JSON editor.
    watchEditorChanges(editor);

    return editor;
  }
}
// editor is not fully typed so we have to disable the eslint rule
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @function watchEditorChanges
 * @description This function sets up a watcher for changes in the JSON editor. When a change is detected, it updates the credit points and module ID of the module that was changed.
 * @param {any} editor - The JSON editor instance.
 */
function watchEditorChanges(editor: any) {
  // Define the callback for the watcher.
  const watcherCallback = function (path: string) {
    try {
      // Define the regex to match the path of the changed module.
      const regex = /^([^]+)\.module\.(\d+)\.name$/;

      // Match the path against the regex.
      const match = path.match(regex);

      // If the path matches the regex, update the credit points and module ID of the module.
      if (match) {
        // Get the value of the changed module.
        const module = editor.getEditor(match[0]).getValue();
        // Define the paths to the credit points and module ID of the module.
        const creditPoints =
          match[1] + '.module' + '.' + match[2] + '.creditPoints';
        const moduleID = match[1] + '.module' + '.' + match[2] + '.moduleID';
        
        // Set the credit points and module ID of the module in the JSON editor.
        editor.getEditor(creditPoints).setValue(module.moduleCredits);
        editor.getEditor(moduleID).setValue(module.moduleID);
      }
    } catch (e) {
      // Log any errors.
      console.log(e);
    }
  };

  // Set up the watcher for changes in the JSON editor.
  editor.on('change', () => {
    // For each editor in the JSON editor, set up a watcher for changes.
    for (const key in editor.editors) {
      // Check if the key is a property of the editors object and is not the root editor.
      if (
        Object.prototype.hasOwnProperty.call(editor.editors, key) &&
        key !== 'root'
      ) {
        // we dont want to double watch the same key so we have to unwatch every key first
        // regardless if it is already watched or not
        // Unwatch the key.
        editor.unwatch(key, watcherCallback.bind(editor, key));

        // Watch the key.
        editor.watch(key, watcherCallback.bind(editor, key));
      }
    }
  });
}
