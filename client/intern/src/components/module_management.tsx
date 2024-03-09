import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ModuleServices from '../database_services/ModuleServices'; // for database functionality
import Table from '@mui/joy/Table';
import { AxiosError } from 'axios';
import { CustomSnackbarContent } from './customSnackbarContent';
import {Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Snackbar} from '@mui/material';

/**
 * Called when button is clicked to create new database entry and add it to database
 * @param values The entries made by the user for each of the input fields (id, name, credits, language, applicability)
 */
function handleButtonClick(values: string[]) {
    const newModule = {
      id: values[0],
      name: values[1],
      credits: values[2],
      language: values[3],
      applicability: values[4]
    };

    ModuleServices.create(newModule)
      .then((response: { data: object; }) => { 
        console.log("Success at saving module");
        console.log(response.data);
      })
      .catch((e: Error) => { 
        console.log("Error while saving module");
        console.log(e);
      });
}

/**
 * if there is an empty field, the button is disabled and can not be clicked
 * @param values The entries made by the user for each of the input fields (id, name, credits, language, applicability)
 * @returns if the button is disabled
 */
function isAddButtonDisabled(values: string[]) {
  return!(values[0].length !=0 && values[1].length !=0 && values[2].length !=0 && values[3].length !=0 && values[4].length !=0);
}

/**
 * 
 * @returns the UI for manually inserting modules into the database and searching for certain modules
 */
export default function AddModuleFields() {
  const [rowsFound, setRowsFound] = useState(Array(0).fill({moduleID: "", moduleName: "", moduleCredits: NaN, moduleLanguage: "", moduleApplicability: ""}));
  const [addModuleParameters, setAddModuleParameters] = React.useState(Array(5).fill(""));
  const [moduleToBeDeleted, setmoduleToBeDeleted] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false); 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  /**
   * if delete button is clicked the dialog box is opened and the id of the module saved
   * @param id the moduleID of the module to be deleted
   */
  function handleDelete(id: string){
    setmoduleToBeDeleted(id);
    setDialogOpen(true);
  }

  /**
   * if delete is clicked in the dialog box then the module is deleted,
   * the rows displayed are updated, and the success/failure of deleting the 
   * module is shown to the user
   */
  function handleConfirmDelete() {
    if (moduleToBeDeleted !== null)
      ModuleServices.deleteModule(moduleToBeDeleted)
        .then(() => {
          setmoduleToBeDeleted(null);
          setRowsFound (rowsFound.filter(
            (row) => row.moduleID !== moduleToBeDeleted
          ));
          setSnackbarMessage('Modul wurde erfolgreich entfernt.');
          setSaveSuccess(true);
          setSnackbarOpen(true);
          setDialogOpen(false);
        })
        .catch((e: Error) => {
          console.error(e);
          setSnackbarMessage('Fehler beim Löschen des Moduls. ' + e.message);
          setSaveSuccess(false);
          setSnackbarOpen(true);
          setDialogOpen(false);
        });
    else console.error('moduleToBeDeleted cannot be null'); 
  }
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, entryIdentifier: number) => {
    const nextModule = addModuleParameters.slice();
    nextModule[entryIdentifier] = event.target.value;
    setAddModuleParameters(nextModule);
   };

  // if the search button is clicked the empty fields are set to undefinded and then getModules is called
  const handleSearchClick = (values: string[]) => {
    const values_copy = Array(5).fill("")
    for (let i = 0; i < 5; i++) {
      if (values[i].length == 0) values_copy[i] = "undefined"
      else values_copy[i] = values[i]
    }
    ModuleServices.getModules(values_copy[0], values_copy[1], values_copy[2], values_copy[3], values_copy[4])
      .then((response: { data: { moduleID: string; moduleName: string; moduleCredits: number; moduleLanguage: string; moduleApplicability: string; createdAt: object; id: object, updatedAt: object}[]; }) => { 
        console.log("Success at getting module");
        console.log(response.data);
        setRowsFound(response.data);
      })
      .catch((e: AxiosError) => { 
        if (e.response?.data == 'The search request yielded more than 50 requests') {
          console.log('The search request yielded more than 50 requests')
          setRowsFound(Array(0).fill({moduleID: "", moduleName: "", moduleCredits: NaN, moduleLanguage: "", moduleApplicability: ""}))
        }
        else {
          console.log("Error while getting module");
          console.log(e);
        }
      });
  }
  return (
    <> 
    <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Bestätigung</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {"Bist du dir sicher, dass du das Modul mit ID " + moduleToBeDeleted + "löschen möchtest?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Abbrechen
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Löschen
          </Button>
        </DialogActions>
    </Dialog>
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        {/* Each of the TextFields updates its entry of the addModuleParameters array when changed */}
        <TextField
          required
          id="Modulnummer"
          label="Modulnummer"
          value = {addModuleParameters.slice()[0]}
          defaultValue=""
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {handleChange(event, 0)}}
        />
        <TextField
          required
          id="Modulname"
          label="Modulname"
          value = {addModuleParameters.slice()[1]}
          defaultValue=""
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {handleChange(event, 1)}}
        />
        <TextField
          required
          id="CP-Anzahl"
          label="CP-Anzahl"
          value = {addModuleParameters.slice()[2]}
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {handleChange(event, 2)}}
        />
        <TextField
          required
          id="Sprache"
          label="Sprache"
          value = {addModuleParameters.slice()[3]}
          defaultValue=""
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {handleChange(event, 3)}}
        />
        <TextField
          required
          id="Verwendbarkeit"
          label="Verwendbarkeit"
          value = {addModuleParameters.slice()[4]}
          defaultValue=""
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {handleChange(event, 4)}}
        />
      </div>
      </Box>
        <Button variant="outlined" sx={{ marginTop: 2, marginBottom: 2 }} disabled = {isAddButtonDisabled(addModuleParameters)} onClick = {() => handleButtonClick(addModuleParameters)}>Speichern</Button>
        <Button variant="outlined"  sx={{ marginTop: 2, marginBottom: 2 }} onClick = {() => handleSearchClick(addModuleParameters)}>Suchen</Button>
        <Table hoverRow sx={{ '& tr > *:not(:first-child)': { textAlign: 'right' }
            }}>
          <thead>
            <tr>
              <th>Modulnummer</th>
              <th>Modulname</th>
              <th>CP</th>
              <th>Sprache</th>
              <th>Verwendbarkeit</th>
              <th style={{ width: 120 }} ></th>
            </tr>
          </thead>
          <tbody>
            {/* If the search button is clicked and rowsFound is not empty the rows are displayed and the fields where one can add a module set if a module is clicked on */}
            {rowsFound.map((row) => (
              <tr key={row.moduleID} onClick = {() => {}} >
                <td>{row.moduleID}</td>
                <td>{row.moduleName}</td>
                <td>{row.moduleCredits}</td>
                <td>{row.moduleLanguage}</td>
                <td>{row.moduleApplicability}</td>
                <td >
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    color="secondary"
                    onClick={() => {handleDelete(row.moduleID);}
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => {setAddModuleParameters([row.moduleID, row.moduleName, row.moduleCredits, row.moduleLanguage, row.moduleApplicability]); window.scrollTo(0, 0);}
                    }
                  >
                    <EditIcon />
                  </IconButton>
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => {setSnackbarOpen(false);}}
        >
          <div>
            <CustomSnackbarContent
              message={snackbarMessage}
              variant={saveSuccess ? 'success' : 'error'}
              onClose={() => {setSnackbarOpen(false);}}
            />
          </div>
        </Snackbar>
        </>
      );
    }