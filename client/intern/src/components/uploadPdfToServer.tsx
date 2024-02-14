import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React from 'react';
import axios from 'axios';
import ModuleServices from '../database_services/ModuleServices';
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
  
async function uploadPdfToDatabase(data:Array<Array<JSON>>|null){
  if(data == null) return;
  let numAddedModules =0;
  let numChangedModules =0;
  let numUnChangedModules =0;
  let numErrorModules =0;
  const listOfNotFullyFilledModules = [];
  /**
   * Compares the Module from the database with the inputted Module from the pdf, 
   * if they are the same, the number of unchanged modules is increased, 
   * if the inputted module is different from the one in the database, the database module is updated, if the module is fully filled
   * @param module the module from the database
   * @param values the inputted module from the pdf
   */
  const compareModules = (module: { moduleID: string; moduleName: string; moduleCredits: number; moduleLanguage: string; moduleApplicability: string; createdAt: object; id: object, updatedAt: object}, values: string[]) => {
    if (module.moduleID === values[0] && module.moduleName === values[1] && module.moduleCredits === parseInt(values[2]) && module.moduleLanguage === values[3] && module.moduleApplicability === values[4]) {
      numUnChangedModules++;
    } else if(parseInt(values[5]) != 0){
      ModuleServices.update(values[0], {
        moduleID: values[0],
        moduleName: values[1],
        moduleCredits: values[2],
        moduleLanguage: values[3],
        moduleApplicability: values[4]
      }).then(()=> numChangedModules++).catch(()=> numErrorModules++);//
    } else {
      numErrorModules++;
    }
  } 
  
  await Promise.all(data.map( async (element) => { //loop through the array of arrays
    await Promise.all(element.map(async (tmp) => { //loop through the array of objects, each object represents a module
      const values: string[] = Object.values(tmp); //convert the object to an array
      values[2] = values[2].slice(0, -3);
      if(parseInt(values[5]) != 0){ // check if the module is fully filled
        listOfNotFullyFilledModules.push(values);  
      }
      console.log('try getbyID'); 
      try{
        ModuleServices.getByID(values[0]).then((response:{ data: { moduleID: string; moduleName: string; moduleCredits: number; moduleLanguage: string; moduleApplicability: string; createdAt: object; id: object, updatedAt: object}; })=>{
          if(response.data){
            console.log('öffne compareModules');
            compareModules(response.data, values);
          }
          else{//sollte aufgerufen werden, wenn getByID fehlschlägt
            console.log('öffne create');
            ModuleServices.create(values.slice(0,5)).then(()=> 
              {numAddedModules++
              console.log('numAdded increased')}).catch(()=> 
                numErrorModules++);
          }
        });
        
      }catch (e) { //sollte aufgerufen werden, wenn getByID fehlschlägt
        console.log('im getid catch block gelandet');
        //ModuleServices.create(values).then(()=> 
          //numAddedModules++).catch(()=> 
           // numErrorModules++);
      }
    }));
  }));

  alert("Anzahl hinzugefügter Module: " + numAddedModules + "\nAnzahl geänderter Module: " + numChangedModules + "\nAnzahl unveränderter Module: " + numUnChangedModules + "\nAnzahl nicht hinzugefügter Module: " + numErrorModules);
  
}
  
  