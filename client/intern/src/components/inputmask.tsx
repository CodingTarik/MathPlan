import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ChangeEvent } from 'react';
//import readAndFilterData from '../../../../../materno/utils/moduleDescriptionParser.js';
//import pdfjsLib from 'pdfjs-dist';
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
 * @param event 
 * @returns the selected file
 */
const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
  alert(event.target)
  

  /*const selectedFiles = event.target;
  alert(selectedFiles); //ist ein HTML input element
  if(selectedFiles.files && selectedFiles.files.length > 0){
    alert('Ja hat mehr als 0 ...')
      //const selectedFile = selectedFiles[0];
      const buffer = selectedFiles;
      //const reader = new FileReader();
      //reader.readAsArrayBuffer(selectedFile);
      alert(buffer.dataset);
      
      //reader.onload = async (event) => {
       //   const dataBuffer = event.target?.result ;
       //   alert(event.target);
        //  alert(dataBuffer);
        //  let bufferView;
         // if (dataBuffer) {
        //    bufferView = new Uint8Array(dataBuffer as ArrayBuffer);
         // }
         // let data = bufferView ? Array.from(bufferView) : [];
          //let tmp =readAndFilterData(bufferView,'Modulbeschreibung');
         // alert(data);
          //alert(typeof(readAndFilterData));

          //let bufferView = new Uint8Array(dataBuffer);
          //let data = Array.from(bufferView);
          //alert(data);
          const modules = '0' //await readAndFilterData(dataBuffer as Buffer,'Modulbeschreibung');
          alert(modules);
          /*readAndFilterData(dataBuffer as Buffer,'Modulbeschreibung').then((modulelist: any)=>{
            alert(modulelist)
          }).catch((error: string) => [
            alert( 'Error while parsing the pdf file:'+ error)
          ])*/

          // ...

          /*moduleDescriptionParser.then((moduleDescriptionParser) => {
            moduleDescriptionParser.readAndFilterData(dataBuffer,'Modulbeschreibung').then((modulelist: any)=>{
              alert(modulelist)
            }).catch((error: string) => [
              alert( 'Error while parsing the pdf file:'+ error)
            ])
          })*/
        

          /*const searchTerm = 'Modulbeschreibung';
          moduleDescriptionParser.readAndFilterData(dataBuffer,searchTerm).then((modulelist: any)=>{
              alert(modulelist)
          }).catch((error: string) => [
              alert( 'Error while parsing the pdf file:'+ error)
          ])*/
      };
  
/**
 * 
 * @returns the UI for the Button to Upload a 'Modulhandbuch'
 */
export default function InputFileUpload() {

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
  