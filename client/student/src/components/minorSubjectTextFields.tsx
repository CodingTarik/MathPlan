import { FormControl, Textarea } from "@mui/joy";
import { setExamPlan, getExamPlan } from './examPlanVariable';
import objectPath from 'object-path';
import { FormHelperText } from "@mui/material";

export default function MinorSubjectTextFields({
  nestedKeys
}: {
  nestedKeys: string;
}) {
    return <div><FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
    
      <Textarea minRows={1} maxRows= {2}  onChange={(event) => {if (event.target.value.length > 100) window.alert("Der Name ist zu lang, so kann nur ein Teil gespeichert werden."); else {const examPlan = getExamPlan(); objectPath.set(examPlan, nestedKeys+".minorSubject", event.target.value), setExamPlan(examPlan)}}} />
      <FormHelperText>Geben Sie hier, wenn nötig, Ihr Nebenfach an (max. 100 Zeichen)</FormHelperText>
  </FormControl>
  <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
  
    <Textarea minRows={4} maxRows= {8}  onChange={(event) => {if (event.target.value.length > 1000) window.alert("Der Text ist zu lang, so kann nur ein Teil gespeichert werden."); else {const examPlan = getExamPlan(); objectPath.set(examPlan, nestedKeys+".minorSubjectModules", event.target.value), setExamPlan(examPlan)}}} />
    <FormHelperText>Tragen Sie hier alle Module mit CP, Name und Modulnummer ein, die Sie im Rahmen Ihres Nebenfachs belegt haben und in Ihren Abschluss einbringen möchten
 (max. 1000 Zeichen)</FormHelperText>
</FormControl></div>
}