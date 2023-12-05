import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// TODO Tarik fragen, wie das ungeschummelt geht
/* eslint-disable */
// @ts-ignore
import ModuleServices from '../database_services/ModuleServices'; // for database functionality
//const ModuleServices = require('../database_services/ModuleServices');

function handleButtonClick(values: string[]) {
  //console.log(addModuleParameters);
  // if successful reset state
    const newModule = {
      id: values[0],
      name: values[1],
      credits: values[2],
      language: values[3],
      applicability: values[4]
    };

    console.log("Module to be added:");
    console.log(newModule);

    ModuleServices.create(newModule)
      .then((response: { data: any; }) => { // TODO datentyp von data statt any
        console.log("Success at saving module!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log(response.data);
      })
      .catch((e: any) => { // TODO datentyp von e statt any
        console.log("Error while saving module!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log(e);
      });
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
    <Button variant="outlined" onClick = {() => handleButtonClick(addModuleParameters)}>Speichern</Button>
    </>
  );
}