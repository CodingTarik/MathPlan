import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React from 'react';
import axios from 'axios';

/**
 * Styled component for the input element of the file upload button
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
 * Sends a POST request to the server to upload all the elected PDF files
 * @returns the UI for the Button to Upload a 'Modulhandbuch'
 */
export default function PdfFileUpload() {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files){
      const files = event.target.files;
      const formData = new FormData();
      for (let i=0 ; i < files.length ; i++) {
        formData.append('file', files[i]); 
      }
      const response =  await axios.post( 'api/intern/uploadPDFtoServer', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if(response.status===500){
          console.error("Upload fehlgeschlagen");
          
        }
        else{
        console.log('Upload successfull: ', response); 
        //console.log(response.data);
        uploadPdftoDatabase(response.data);
      }
    }  
    };
  return (
    <div>
    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
        Modulhandbücher hochladen
      <VisuallyHiddenInput type="file"
      accept='.pdf'
      multiple
      onChange={handleFileChange}
      />
    </Button> 
    </div>
  
  );

  }
  
  function uploadPdftoDatabase(data:Array<Array<JSON>>|null){
    // not yet implemented
    console.log('Nun sollten die Module in die Datenbank geschrieben werden: ');
    console.dir(data);
  }
  