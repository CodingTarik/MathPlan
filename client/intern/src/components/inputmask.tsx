import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React /*, { FormEvent }*/ from 'react';
//import axios from "axios";

/**
 * 
 * @param props 
 * @returns the UI for the Button to Upload a 'Modulhandbuch'
 */
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


/**
 * 
 * @returns the UI for the Button to Upload a 'Modulhandbuch'
 */
export default function PdfFileUpload() {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const target = event.target;
  const files = target.files;
  console.log(files);

  };

  return (
    <div>
    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
        Modulhandbuch auswählen
      <VisuallyHiddenInput type="file"
      onChange={handleFileChange}
      accept='.pdf'
      multiple />
    </Button>
    </div>
  
  );

  }
  