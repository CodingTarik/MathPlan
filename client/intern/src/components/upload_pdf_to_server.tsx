import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React from 'react';
import axios from 'axios';
//import ModuleServices from '../database_services/ModuleServices';
import  { handleButtonClick } from './module_management';
//import ModuleServices from '../database_services/ModuleServices';

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
    let numAddedModules =0;
    let numChangedModules =0;
    let numUnChangedModules =0;
    let numErrorModules =0;
/*
    const compareModules = (module: { moduleID: string; moduleName: string; moduleCredits: number; moduleLanguage: string; moduleApplicability: string; createdAt: object; id: object, updatedAt: object}, values: string[]) => {
      if (module.moduleID == values[0] && module.moduleName == values[1] && module.moduleCredits == parseInt(values[2]) && module.moduleLanguage == values[3] && module.moduleApplicability == values[4]) {
        numUnChangedModules++;
      } else {
        numChangedModules++;
        /*TODO: wieder einfügen, sobald update im branch ist!!!
        ModuleServices.update(module.id, {
          moduleID: values[0],
          moduleName: values[1],
          moduleCredits: parseInt(values[2]),
          moduleLanguage: values[3],
          moduleApplicability: values[4]
        })//
      }
    }*/
    data?.forEach((element) => {
      element.forEach((tmp) => {
        let values = Object.values(tmp);
        values[2] = values[2].slice(0, -3);
        try{
          handleButtonClick(values);
        }catch (e) {
          numErrorModules++;
          /*ModuleServices.getModules(values[0],'','','','')
            .then((response: { data: { moduleID: string; moduleName: string; moduleCredits: number; moduleLanguage: string; moduleApplicability: string; createdAt: object; id: object, updatedAt: object}[]; }) => {
              if (response.data.length == 0) {
                numAddedModules++;
                handleButtonClick(values);
              } else {
                compareModules(response.data[0], values);
              }
            });*/
        }

         

      });
      alert("Anzahl hinzugefügter Module: " + numAddedModules + "\nAnzahl geänderter Module: " + numChangedModules + "\nAnzahl unveränderter Module: " + numUnChangedModules + "\nAnzahl nicht hinzugefügter Module: " + numErrorModules);
    });
    
}
  