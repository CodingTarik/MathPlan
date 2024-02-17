import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React from 'react';
import axios from 'axios';
import ModuleServices from '../database_services/ModuleServices';

/**
 * Sends a POST request to the server to upload all the selected PDF files
 * @returns the UI for the Button to Upload a 'Modulhandbuch'
 */
export default function pdfFileUpload() {
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
        if(response.data[1].length > 0){
          alert('The following files could not be uploaded: \n- '+ response.data[1].join(',\n- '));
        }
        console.log('Uploaded successfully ', response.data[0].length + ' file(s). \nFailed uploading ' + response.data[1].length + ' file(s).'); 
        const resultOfUplaod = await uploadPdfToDatabase(response.data[0]);
        alert(resultOfUplaod);
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
type Module = {
  id: string,
  name: string,
  credits: number,
  language: string,
  applicability: string
};

async function uploadPdfToDatabase(files : Array<Array<JSON>>): Promise<string>{
  const listOfNotUpdatedModules: Module[] = [];
  const listOfUpdatedModules: Module[] = [];
  const listOfFailedModules: Module[] = [];
  const listOfAddedModules: Module[] = [];
  for (const file of files){ //loop through all files
    for(const element of file){ // loop through all chucks of modules
      const modulvalues: string[] = Object.values(element);
      for (let i=0; i<modulvalues.length; i++){ // check if any value of a module is null or empty
        if (modulvalues[i].length === 0|| modulvalues[i] === null){
          modulvalues[i] = '';
        }
      }
      const module= { // the module object to be inserted or updated in the database
        id: modulvalues[0],
        name: modulvalues[1],
        credits: parseInt(modulvalues[2].slice(0, -3)),
        language: modulvalues[3],
        applicability: modulvalues[4]
      }
      await ModuleServices.getByID(module.id)
      .then(async (response) => {
        if (response.data) { // ID was found (data !== null)
          // check if the module needs modification
          if(module.id === response.data.moduleID && 
            module.name === response.data.moduleName && 
            module.credits === response.data.moduleCredits &&
            module.language === response.data.moduleLanguage &&
            module.applicability === response.data.moduleApplicability){
            listOfNotUpdatedModules.push(module); 
          }
          else{
            // modifiying module with the new values from the pdf
            await ModuleServices.update(module.id, module).then(() => {
              listOfUpdatedModules.push(module);
            }).catch((e: Error) => { 
              console.log(e);
              listOfFailedModules.push(module);
            });
          }
        } else { // ID was not found in the Database (data === null)
          // inserting module
          await ModuleServices.create(module)
            .then(() => { 
              listOfAddedModules.push(module);
            })
            .catch((e: Error) => { 
              console.error("Error while saving module to the database: " + e);
            });
        }
      })
      .catch((e: Error) => {
        console.error('Error while getting module from database: ' +e);
      });
    }
  } 
  console.log('Folgende Module waren schon exakt so in der Datenbank vorhanden:');
  console.dir(listOfNotUpdatedModules);
  const responseAboutFailedModules= (listOfFailedModules.length === 0) ? '' : '\nEs sind ' + listOfFailedModules.length + ' Module fehlgeschlagen.'+
  'das waren die Module: ' + listOfFailedModules.map((module) => module.id).join(',\n- ');
  const message =
    listOfAddedModules.length +' Module wurden in die Datenbank eingefügt.' +
    '\n' + listOfUpdatedModules.length + ' Module wurden aktualisiert.' +
    '\n' + listOfNotUpdatedModules.length + ' Module waren bereits so in der Datenbank vorhanden.' +
    responseAboutFailedModules;
  return message;
}
