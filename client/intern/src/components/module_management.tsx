import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function handleButtonClick(values: string[]) {
  //console.log(addModuleParameters);
  // if successful reset state
  
  console.log(values);
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
          onChange={(event) => {
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
          onChange={(event) => {
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
          onChange={(event) => {
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
          onChange={(event) => {
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