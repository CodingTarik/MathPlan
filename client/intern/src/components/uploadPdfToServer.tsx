import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React from 'react';
import axios from 'axios';

/**
 * Styled component for the input element of the file upload button
 * @param props 
 * @returns the hidden input element for the file selection 
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
 * Sends a POST request to the server to upload all the selected PDF files
 * @returns the UI for the Button to Upload a 'Modulhandbuch'
 */
export default function pdfFileUpload() {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files){
      const files = event.target.files;
      const formData = new FormData();
      for (let i=0 ; i < files.length ; i++) {
        formData.append('file', files[i]); 
      }
      try {
      const response =  await axios.post( 'api/intern/uploadPDFtoServer', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Uploaded successfully ', response.data[0].length + ' file(s). \nFailed uploading ' + response.data[1].length + ' file(s).'); 
        uploadPdfToDatabase(response.data[0]); // functionality not yet implemented
        if(response.data[1].length > 0){
          alert('The following files could not be uploaded: \n- '+ response.data[1].join(',\n- '));
        }
      }catch (error) {
          console.error("Upload fehlgeschlagen"+ error);
          alert("Upload fehlgeschlagen:"+ error);  
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
  
  function uploadPdfToDatabase(data:Array<Array<JSON>>|null){
    // not yet implemented
    console.log('Nun sollten die Module in die Datenbank geschrieben werden: ');
    console.dir(data);
  }
  