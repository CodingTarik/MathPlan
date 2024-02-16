import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React from 'react';
import axios from 'axios';
import ModuleServices from '../database_services/ModuleServices';
//import ModuleServices from '../database_services/ModuleServices';

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
type Module = {
  id: string,
  name: string,
  credits: number,
  language: string,
  applicability: string
};

async function uploadPdfToDatabase(files : Array<Array<JSON>>){
  const listOfAddedModules: Module[] = [];
  const listOfUpdatedModules: Module[] = [];
  const listOfNotUpdatedModules: Module[] = [];
  const listOfFailedModules: Module[] = [];
  files.forEach(async (file) => {
    file.forEach(async (element)=>{
      const modulvalues= Object.values(element);
      for (let i=0; i<modulvalues.length; i++){
        if (modulvalues[i].length === 0|| modulvalues[i] === null){
          modulvalues[i] = '';
        }
      }
      const module= {
        id: modulvalues[0],
        name: modulvalues[1],
        credits: parseInt(modulvalues[2].slice(0, -3)),
        language: modulvalues[3],
        applicability: modulvalues[4]
      }
      try {
        await ModuleServices.create(module).then(()=>{
          //modul was added to the database
          listOfAddedModules.push(module);
        }).catch(()=>{});
      } catch (e) {
        //modul seems to be already in the database
        await ModuleServices.getByID(module.id).then(async (response)=>{
          //check if the modul is equal to the one in the database
          if(module.id == response.data.moduleID && 
            module.name == response.data.moduleName && 
            module.credits == response.data.moduleCredits &&
            module.language == response.data.moduleLanguage &&
            module.applicability == response.data.moduleApplicability){
            listOfNotUpdatedModules.push(module); 
          }
          else{
            //so we need to update the modul
            await ModuleServices.update(module.id, module).then(()=>{
                listOfUpdatedModules.push(module);
              }).catch(()=>{
                //modul could not be updated
                listOfFailedModules.push(module);
              });
            }
        });
      }
      if(file === files[files.length-1]){
        if(element === file[file.length-1]){
          //await Promise.all([promise]); //naja jetzt werden halt nicht alle promises abgewartet
          console.log('Added modules: ', listOfAddedModules.length);
          console.log('Updated modules: ', listOfUpdatedModules.length);
          console.log('Not updated modules: ', listOfNotUpdatedModules.length);
          console.log('Failed modules: ', listOfFailedModules);
        }
      }
    });
  }); 
}
