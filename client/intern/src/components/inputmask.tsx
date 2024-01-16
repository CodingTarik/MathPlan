import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React, { useState } /*, { FormEvent }*/ from 'react';
import axios from 'axios';

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
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
      console.log(selectedFiles);
      handleUplaod();
    }
    
  };
  const handleUplaod = async () => {
    try{
    if (!selectedFiles) {
      console.error('No files selected');
      return;
    }
    const formData = new FormData();
    for (let i=0;i<selectedFiles!.length;i++){
      formData.append('file', selectedFiles![i]);
    }
    
     const response=  await axios.post( 'api/intern/uploadPDF', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload successfull: /n', response); 
    }catch (err){
      console.error('Upload failed:', err);
    }
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
  