/**
 * @author Tarik Azzouzi
 */
import schema from '../assets/examinationregulation.schema.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import React, { useRef, useEffect, useState } from 'react';
import { Button, Snackbar, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, SnackbarContent, TextField} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { saveExamRegulationFunction } from '../database_services/ExamRegulationService.ts';

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

async function saveFunction(internalName: string): Promise<boolean> {
  // Get the value of the editor
  const examValue = window.JSONEditorInstance.getValue();
  return saveExamRegulationFunction(examValue, internalName);
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
    window.JSONEditorInstance = editor;
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
      // Check any module name changes
      {
        // Use regex to extract information from the changed path
        // e.g. root.area.module.0.name
        const regex = /^([^]+)\.module\.(\d+)\.name$/;
        // Check if the path matches the regex
        const match = path.match(regex);

        if (match) {
          // Build the result path and set a specific value in the editor
          const module = editor.getEditor(match[0]).getValue();
          const creditPoints =
            match[1] + '.module' + '.' + match[2] + '.creditPoints';
          const moduleID = match[1] + '.module' + '.' + match[2] + '.moduleID';
          // Will be used for maping, set CP field to coressponding module credit points if new module selected
          /** @todo: This is a temporary test solution, needs to be changed*/
          editor.getEditor(creditPoints).setValue(module.moduleCredits);
          editor.getEditor(moduleID).setValue(module.moduleID);
        }
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
        // checks that the key is not inherited from the prototype
        Object.prototype.hasOwnProperty.call(editor.editors, key) &&
        key !== 'root'
      ) {
        // Unwatch and re-watch each key to ensure callback is triggered just once
        editor.unwatch(key, watcherCallback.bind(editor, key));
        editor.watch(key, watcherCallback.bind(editor, key));
      }
    }
  });
}
interface CustomSnackbarContentProps {
  message: string;
  variant: 'success' | 'error';
  onClose: (event: React.SyntheticEvent, reason: string) => void;
}

function CustomSnackbarContent({
  message,
  variant,
  onClose
}: CustomSnackbarContentProps) {
  const icon = variant === 'success' ? <CheckCircleIcon /> : <ErrorIcon />;
  const backgroundColor = variant === 'success' ? 'green' : 'red';

  return (
    <SnackbarContent
      style={{
        backgroundColor: backgroundColor,
        display: 'flex',
        alignItems: 'center'
      }}
      message={
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {icon}
          &nbsp;&nbsp;{message}
        </span>
      }
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={(e) => onClose(e, 'clickaway')}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [internalName, setInternalName] = useState('');
  saveSuccess; // @todo   Remove this line once the variable is used
  const handleSaveClick = () => {
    setDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    // Hier sollte deine Funktion für das Speichern und die Verarbeitung des Rückgabewerts implementiert werden
    // Zum Beispiel:
    try {
      // Annahme: saveFunction ist eine asynchrone Funktion, die true oder false zurückgibt
      const saveResult = await saveFunction(internalName);

      if (saveResult) {
        setSnackbarMessage('Erfolgreich gespeichert!');
        setSaveSuccess(true);
      } else {
        setSnackbarMessage('Fehler beim Speichern!');
        setSaveSuccess(false);
      }

      setSnackbarOpen(true);
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
    }

    setDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  /**
   * Effect hook for initializing the JSON Editor.
   */
  useEffect(() => {
    initializeJsonEditor(editorRef);
  }, []);

  // Render a div element and assign the ref
  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <TextField
          label="Internal Name"
          value={internalName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setInternalName(event.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveClick}
        >
          Speichern
        </Button>
      </div>

      <div ref={editorRef} />

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Bestätigung</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Möchten Sie die Änderungen wirklich speichern?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Abbrechen
          </Button>
          <Button onClick={handleConfirmSave} color="primary" autoFocus>
            Speichern
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center' // Änderung hier, um die Snackbar in der Mitte anzuzeigen
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <div>
          <CustomSnackbarContent
            message={snackbarMessage}
            variant={saveSuccess ? 'success' : 'error'}
            onClose={handleSnackbarClose}
          />
        </div>
      </Snackbar>
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
    JSONEditorInstance: any;
  }
}

// Export the `AppWithoutStrictMode` component for use in other files
export default AppWithoutStrictMode;
