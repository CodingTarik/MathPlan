import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React, { FormEvent } from 'react';
import axios from "axios";

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
  const [files, setFiles] = React.useState<File []| null>([]);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files){
      const _files = Array.from(event.target.files);
      setFiles(_files);
      console.log(files?.length);
      
    };
  };

  const handleSubmit = async () =>  {
    if (files){
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
        }

      try {
        const res = await fetch ('../../../../../materno/utils/upload',{
          method: 'POST',
          body: formData, 
        });
        console.log('Upload successful',res);

      } catch (error) {
        console.error('Error uploading files!', error);
      } 
    } 
  };

  return (
    <div>
      <form method = "POST" encType="multipart/form-data" onSubmit={handleSubmit}>
    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
        Modulhandbuch auswählen
      <VisuallyHiddenInput type="file"
      onChange={handleFileChange}
      accept='.pdf'
      multiple />
    </Button>
    </form>
    </div>
  
  );

  };
  