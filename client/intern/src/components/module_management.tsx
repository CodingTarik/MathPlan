//import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function AddModuleFields() {
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
        />
        <TextField
          required
          id="Modulname"
          label="Modulname"
          defaultValue=""
        />
        <TextField
          required
          id="CP-Anzahl"
          label="CP-Anzahl"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          required
          id="Verwendbarkeit"
          label="Verwendbarkeit"
          defaultValue=""
        />
         <TextField
          required
          id="Sprache"
          label="Sprache"
          defaultValue=""
        />
      </div>
    </Box>
    <Button variant="outlined">Speichern</Button>
    </>
  );
}