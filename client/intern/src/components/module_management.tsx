import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import ModuleServices from '../database_services/ModuleServices'; // for database functionality

/**
 * Called when button is clicked to create new database entry and add it to database or to modify existing entry
 * @param values The entries made by the user for each of the input fields (id, name, credits, language, applicability)
 */
function handleButtonClick(values: string[]) {
  // wrapping module als json object
    const tmpModule = {
      id: values[0],
      name: values[1],
      credits: values[2],
      language: values[4],
      applicability: values[3]
    };

  // test if module with ID tmpModule.id is already in database
  ModuleServices.getByID(tmpModule.id)
    .then((response: { data: object; }) => {
      if (response.data) { // ID was found (data !== null)
        console.log("trying retrieving modul by ID: data found");
        // modifying module
        ModuleServices.update(values[0], tmpModule)
          .then((response: { data: object; }) => { 
            console.log("Response data:");
            console.log(response.data);
          })
          .catch((e: Error) => { 
            console.log(e);
          });
      } else { // ID was not found (data === null)
        console.log("trying retrieving modul by ID: data not found");
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
 * @returns the UI for manually inserting modules into the database
 */
export default function AddModuleFields() {
  const [moduleParameters, setmoduleParameters] = React.useState(Array(5).fill(""));
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, entryIdentifier: number) => {
    const nextModule = moduleParameters.slice();
    nextModule[entryIdentifier] = event.target.value;
    setmoduleParameters(nextModule);
   };
 
  return (
    <>
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
          defaultValue=""
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {handleChange(event, 0)}}
        />
        <TextField
          required
          id="Modulname"
          label="Modulname"
          defaultValue=""
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {handleChange(event, 1)}}
        />
        <TextField
          required
          id="CP-Anzahl"
          label="CP-Anzahl"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {handleChange(event, 2)}}
        />
        <TextField
          required
          id="Verwendbarkeit"
          label="Verwendbarkeit"
          defaultValue=""
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {handleChange(event, 3)}}
        />
         <TextField
          required
          id="Sprache"
          label="Sprache"
          defaultValue=""
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {handleChange(event, 4)}}
        />
      </div>
    </Box>
    <Button variant="outlined" disabled = {isAddButtonDisabled(moduleParameters)} onClick = {() => handleButtonClick(moduleParameters)}>Speichern</Button>
    </>
  );
}