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
  /**
   * Handles the change event of the file input element: it sends a POST request to the server to upload the selected files
   * and then sends the respone data to the database and informs the user about the result of the upload
   * @param event the change event of the file input element
   */
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
          console.log('Failed uploading ' + response.data[1].length + ' file(s). \n');
          alert('The following files could not be uploaded: \n- '+ response.data[1].join(',\n- '));
        }
        if(response.data[0].length > 0){
          console.log('Uploaded successfully ', response.data[0].length + ' file(s).'); 
          const resultOfUplaod = await uploadPdfToDatabase(response.data[0]);
          alert(resultOfUplaod);
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
type Modul = {
  id: string,
  name: string,
  credits: number,
  language: string,
  applicability: string
};
/**
 * Uploads the parsed data from the pdf to the database, it adds new modules & updates existing modules:
 * - if a module is already in the database and has the same values as in the pdf, it will not be updated
 * - if a module is already in the database but has different values than in the pdf, it will be updated
 * - if a module is not in the database, it will be added 
 * @param files the parsed data from the pdf
 * @returns a message about the result of the upload
 */
async function uploadPdfToDatabase(files : Array<Array<JSON>>): Promise<string>{
  const listOfNotUpdatedModules: Modul[] = [];
  const listOfUpdatedModules: Modul[] = [];
  const listOfFailedModules: Modul[] = [];
  const listOfAddedModules: Modul[] = [];
  for (const file of files){ // loop through all files
    for(const element of file){ // loop through all modules
      const moduleValues: string[] = Object.values(element);
      for (let i=0; i<moduleValues.length; i++){ // check if any value of a module is null or empty
        if ( !moduleValues[i] ){
          moduleValues[i] = '';
        }
      }
      let credits = moduleValues[2].slice(0, -3);
      if (credits === '') // there was no information on credit points
        // empty string converted into int results in NaN, which results in null when inserted into database
        credits = '-1';
      const modul : Modul = { // the modul object to be inserted or updated in the database
        id: moduleValues[0],
        name: moduleValues[1],
        credits: parseInt(credits),
        language: moduleValues[3],
        applicability: moduleValues[4]
      }
      await ModuleServices.getByID(modul.id)
      .then(async (response) => {
        if (response.data) { // ID was found (data !== null)
          // check if the modul needs modification
          if(modul.id === response.data.moduleID && 
            modul.name === response.data.moduleName && 
            modul.credits === response.data.moduleCredits &&
            modul.language === response.data.moduleLanguage &&
            modul.applicability === response.data.moduleApplicability){
            listOfNotUpdatedModules.push(modul); 
          }
          else{
            // modifiying modul with the new values from the pdf
            await ModuleServices.update(modul.id, modul).then(() => {
              listOfUpdatedModules.push(modul);
            }).catch((e: Error) => { 
              console.log(e);
              listOfFailedModules.push(modul);
            });
          }
        } else { // ID was not found in the Database (data === null)
          // inserting module
          await ModuleServices.create(modul)
            .then(() => { 
              listOfAddedModules.push(modul);
            })
            .catch((e: Error) => { 
              console.error("Error while saving module to the database: " + e);
              listOfFailedModules.push(modul);
            });
        }
      })
      .catch((e: Error) => {
        console.error('Error while getting module from database: ' +e);
        listOfFailedModules.push(modul);
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
