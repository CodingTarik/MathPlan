import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import ModuleServices from '../database_services/ModuleServices'; // for database functionality


// called when button is clicked to create new database entry and add it to database
function handleButtonClick(values: string[]) {
  if (values[0] !== null && values[1] !== null && values[2] !== null && values[3] !== null && values[4] !== null) {
    const newModule = {
      id: values[0],
      name: values[1],
      credits: values[2],
      language: values[4],
      applicability: values[3]
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
}

// if there is an empty field, the button is disabled and can not be clicked
function isAddButtonDisabled(values: string[]) {
  return!(values[0] !== null && values[1] !== null && values[2] !== null && values[3] !== null && values[4] !== null);
}

export default function AddModuleFields() {
  const [addModuleParameters, setAddModuleParameters] = React.useState(Array(5).fill(null));

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
        {/* Each of the TextFields updates its entry of the addModuleParameters array when changed */}
        <TextField
          required
          id="Modulnummer"
          label="Modulnummer"
          defaultValue=""
          onChange={(event) => {
            const nextModule = addModuleParameters.slice();
            nextModule[0] = event.target.value;
            setAddModuleParameters(nextModule);
          }}
        />
        <TextField
          required
          id="Modulname"
          label="Modulname"
          defaultValue=""
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const nextModule = addModuleParameters.slice();
            nextModule[1] = event.target.value;
            setAddModuleParameters(nextModule);
          }}
        />
        <TextField
          required
          id="CP-Anzahl"
          label="CP-Anzahl"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const nextModule = addModuleParameters.slice();
            nextModule[2] = event.target.value;
            setAddModuleParameters(nextModule);
          }}
        />
        <TextField
          required
          id="Verwendbarkeit"
          label="Verwendbarkeit"
          defaultValue=""
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const nextModule = addModuleParameters.slice();
            nextModule[3] = event.target.value;
            setAddModuleParameters(nextModule);
          }}
        />
         <TextField
          required
          id="Sprache"
          label="Sprache"
          defaultValue=""
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const nextModule = addModuleParameters.slice();
            nextModule[4] = event.target.value;
            setAddModuleParameters(nextModule);
          }}
        />
      </div>
    </Box>
    <Button variant="outlined" disabled = {isAddButtonDisabled(addModuleParameters)} onClick = {() => handleButtonClick(addModuleParameters)}>Speichern</Button>
    </>
  );
}