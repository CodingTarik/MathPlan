import React, { useRef, useEffect, useState } from 'react';
import {
  Button,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { CustomSnackbarContent } from './customSnackbarContent';
import {
  saveFunction,
  initializeJsonEditor
} from './examinationRegulationEditor';

/**
 * The main component for the Examination Regulation Application.
 * This component manages the state for the application and renders the UI.
 * @returns {JSX.Element} The rendered component.
 */
function ExaminationRegulationApp() {
  /**
   * @type {React.MutableRefObject<HTMLDivElement | null>}
   * @description Reference to the div that will contain the JSON editor.
   */
  const editorRef = useRef<HTMLDivElement | null>(null);

  /**
   * @type {React.Dispatch<React.SetStateAction<boolean>>}
   * @description State for whether the save dialog is open.
   */
  const [dialogOpen, setDialogOpen] = useState(false);

  /**
   * @type {React.Dispatch<React.SetStateAction<boolean>>}
   * @description State for whether the snackbar is open.
   */
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  /**
   * @type {React.Dispatch<React.SetStateAction<string>>}
   * @description State for the message to display in the snackbar.
   */
  const [snackbarMessage, setSnackbarMessage] = useState('');

  /**
   * @type {React.Dispatch<React.SetStateAction<boolean>>}
   * @description State for whether the last save was successful.
   */
  const [saveSuccess, setSaveSuccess] = useState(false);

  /**
   * @type {React.Dispatch<React.SetStateAction<string>>}
   * @description State for the internal name of the examination regulation.
   */
  const [internalName, setInternalName] = useState('');

  /**
   * @function handleSaveClick
   * @description Handler for when the save button is clicked. Opens the save dialog.
   */
  const handleSaveClick = () => {
    setDialogOpen(true);
  };

  /**
   * @async
   * @function handleConfirmSave
   * @description Handler for when the save is confirmed in the dialog. Attempts to save the examination regulation and updates the state accordingly.
   */
  const handleConfirmSave = async () => {
    try {
      // Attempt to save the examination regulation.
      const saveResult = await saveFunction(internalName);

      // Update the state based on whether the save was successful.
      if (saveResult) {
        setSnackbarMessage('Erfolgreich gespeichert!');
        setSaveSuccess(true);
      } else {
        setSnackbarMessage('Fehler beim Speichern!');
        setSaveSuccess(false);
      }

      // Open the snackbar to display the result of the save.
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
    }

    // Close the save dialog.
    setDialogOpen(false);
  };

  /**
   * @function handleSnackbarClose
   * @description Handler for when the snackbar is closed. Closes the snackbar.
   */
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Initialize the JSON editor when the component is first rendered.
  useEffect(() => {
    initializeJsonEditor(editorRef);
  }, []);

  // Render the UI for the application.
  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <TextField
          label="Internal Name"
          style={{ marginRight: '16px', height: '56px' }}
          value={internalName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setInternalName(event.target.value)
          }
        />
        <Button
          variant="contained"
          color="primary"
          style={{ height: '56px' }}
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
            Möchten Sie die Änderungen wirklich speichern? Sollte der interne Name bereits in der Datenbank vorhanden sein, so wird diese Prüfungsordnung überschrieben.
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
          horizontal: 'center'
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
 * Wrapper component for the ExaminationRegulationApp component.
 * This is used to avoid strict mode issues with the JSON editor.
 * @returns {JSX.Element} The ExaminationRegulationApp component wrapped in a function component.
 */
const AppWithoutStrictMode = () => <ExaminationRegulationApp />;

// Declaration to extend the global Window interface with JSONEditor property
/* eslint-disable @typescript-eslint/no-explicit-any */
// json editor is not typed
declare global {
  /**
   * @interface Window
   * @description Extension of the global Window interface with JSONEditor property.
   */
  interface Window {
    JSONEditor: any;
    JSONEditorInstance: any;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default AppWithoutStrictMode;