import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React from 'react';
import axios from 'axios';
import ModuleServices from '../database_services/ModuleServices';

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
      try {
      const response =  await axios.post( 'api/intern/uploadPDFtoServer', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Upload successfull: ', response.data); 
        uploadPdftoDatabase(response.data); // functionality not yet implemented
      }catch (error) {
          console.error("Upload fehlgeschlagen");
          alert("Upload fehlgeschlagen");  
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
    data?.forEach((element) => {
      element.forEach((module) => {
        const newModule: { [key: string]: string } = {};
        //for (const key in module){
          //console.log(key, (module as object)[key] ); // Logs each property name and value
          //newModule[key] = (module as any)[key];
        //7}
        /* eslint-disable */        
        for (const key in module){
          if (key == "moduleID") newModule["id"] = (module as any)[key];
          if (key == "moduleName") newModule["name"] = (module as any)[key];
          if (key == "moduleCredits") newModule["credits"] = (module as any)[key];
          if (key == "moduleLanguage") newModule["language"] = (module as any)[key];
          if (key == "moduleApplicability") newModule["applicability"] = (module as any)[key];
        /*eslint-enable */
        }
        console.log(newModule);
        try {
          ModuleServices.getModules(newModule.id,'','','','')
            .then((response: { data: { moduleID: string; moduleName: string; moduleCredits: number; moduleLanguage: string; moduleApplicability: string; createdAt: object; id: object, updatedAt: object}[]; }) => { 
              console.log("Already in database");
              console.log(response.data);
            }).catch((e: Error) => {
            throw new Error("Not in database, needs to be created "+e);
            });

        } catch (error) {
          console.log("Error while getting module we we create one: "  +error);
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
      //add those modules to the database
      //ModuleServices.create( (module.moduleID, module.module ))
      });
    });

}
  