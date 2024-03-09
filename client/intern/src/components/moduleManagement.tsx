import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import ModuleServices from '../database_services/ModuleServices'; // for database functionality
import Table from '@mui/joy/Table';
import { AxiosError } from 'axios';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { CustomSnackbarContent } from './customSnackbarContent';
import {Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Snackbar} from '@mui/material';



/**
 * Called when button is clicked to create new database entry and add it to database or to modify existing entry
 * @param values The entries made by the user for each of the input fields (id, name, credits, language, applicability)
 */
function handleButtonClick(values: string[]) {
  // wrapping module as javascript object (is automatically converted into JSON by axios)
    const tmpModule = {
      id: values[0],
      name: values[1],
      credits: values[2],
      language: values[3],
      applicability: values[4]
    };

  // test if module with ID tmpModule.id is already in database
  ModuleServices.getByID(tmpModule.id)
    .then((response: { data: object; }) => {
      if (response.data) { // ID was found (data !== null)
        console.log("trying retrieving module by ID: data found");
        // modifying module
        ModuleServices.update(values[0], tmpModule)
          .then(() => {
            console.log("module modification successful");
            ModuleServices.getByID(tmpModule.id).then((response: { data: object; }) => {
              console.log(response.data);
            }).catch((e: Error) => { 
              console.log(e);
            });
          })
          .catch((e: Error) => { 
            console.log(e);
          });
      } else { // ID was not found (data === null)
        console.log("trying retrieving module by ID: data not found");
        // inserting module
        ModuleServices.create(tmpModule)
          .then((response: { data: object; }) => { 
            console.log("Success at saving module");
            console.log(response.data);
          })
          .catch((e: Error) => { 
            console.log("Error while saving module");
            console.log(e);
          });
      }
    })
    .catch((e: Error) => {
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
  const [moduleParameters, setModuleParameters] = React.useState(Array(5).fill(""));
  const [rowsFound, setRowsFound] = React.useState(Array(0).fill({moduleID: "", moduleName: "", moduleCredits: NaN, moduleLanguage: "", moduleApplicability: ""}));
  const [moduleToBeDeleted, setModuleToBeDeleted] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false); 
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  /**
   * if delete button is clicked the dialog box is opened and the id of the module saved
   * @param id the moduleID of the module to be deleted
   */
  function handleDelete(id: string){
    setModuleToBeDeleted(id);
    setDialogOpen(true);
  }

  /**
   * if delete is clicked in the dialog box, then the module is deleted,
   * the rows displayed are updated, and the success/failure of deleting the 
   * module is shown to the user
   */
  function handleConfirmDelete() {
    if (moduleToBeDeleted !== null)
      ModuleServices.deleteModule(moduleToBeDeleted)
        .then(() => {
          setModuleToBeDeleted(null);
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
    const nextModule = moduleParameters.slice();
    nextModule[entryIdentifier] = event.target.value;
    setModuleParameters(nextModule);
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
            {"Bist du dir sicher, dass du das Modul mit ID " + moduleToBeDeleted + " löschen möchtest?"}
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
        {/* Each of the TextFields updates its entry of the moduleParameters array when changed */}
        <TextField
          required
          id="Modulnummer"
          label="Modulnummer"
          value = {moduleParameters.slice()[0]}
          defaultValue=""
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {handleChange(event, 0)}}
        />
        <TextField
          required
          id="Modulname"
          label="Modulname"
          value = {moduleParameters.slice()[1]}
          defaultValue=""
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {handleChange(event, 1)}}
        />
        <TextField
          required
          id="CP-Anzahl"
          label="CP-Anzahl"
          value = {moduleParameters.slice()[2]}
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
          value = {moduleParameters.slice()[3]}
          defaultValue=""
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {handleChange(event, 3)}}
        />
        <TextField
          required
          id="Verwendbarkeit"
          label="Verwendbarkeit"
          value = {moduleParameters.slice()[4]}
          defaultValue=""
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {handleChange(event, 4)}}
        />
      </div>
      </Box>
        <Button variant="outlined" sx={{ marginTop: 2, marginBottom: 2 }} disabled = {isAddButtonDisabled(moduleParameters)} onClick = {() => handleButtonClick(moduleParameters)}>Speichern</Button>
        <Button variant="outlined"  sx={{ marginTop: 2, marginBottom: 2 }} onClick = {() => handleSearchClick(moduleParameters)}>Suchen</Button>
        <Table hoverRow sx={{ '& tr > *:not(:first-child)': { textAlign: 'right' } }}>
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
            {/* If the search button is clicked and rowsFound is not empty, the rows are displayed. The fields where one can add a module are set if the edit icon is clicked and the module is deleted if the delete icon is clicked */}
            {rowsFound.map((row) => (
              <tr key={row.moduleID} onClick =  {() => {}}  >
                <td>{row.moduleID}</td>
                <td>{row.moduleName}</td>
                <td>{row.moduleCredits}</td>
                <td>{row.moduleLanguage}</td>
                <td>{row.moduleApplicability}</td>
                <td >
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    color="default"
                    onClick={() => {handleDelete(row.moduleID);}
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color="info"
                    onClick={() => {setModuleParameters([row.moduleID, row.moduleName, row.moduleCredits, row.moduleLanguage, row.moduleApplicability]); window.scrollTo(0, 0);}
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