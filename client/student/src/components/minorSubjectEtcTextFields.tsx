import { FormControl, Textarea } from '@mui/joy';
import { setExamPlan, getExamPlan } from './examPlanVariable';
import objectPath from 'object-path';
import { FormHelperText } from '@mui/material';

const needsAdditionalInputFieldForName = [
  'Nebenfach',
  'Nicht-mathematischer Vertiefungsbereich'
];


/**
 * 
 * @param name of  the area
 * @param nestedKeys the path to this subarea within the exam regulation object
 * @returns depending on the name of the area returns a input field for the name of e.g the minor or non-mathematical specialisation subject 
 */
export default function MinorSubjectEtcTextFields({
  nestedKeys,
  name
}: {
  nestedKeys: string;
  name: string;
}) {
  
  return (
    <div>
      {needsAdditionalInputFieldForName.includes(name) && (
        <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
          <Textarea
            minRows={1}
            maxRows={2}
            onChange={(event) => {
              if (event.target.value.length > 100)
                window.alert(
                  'Der Name ist zu lang, so kann nur ein Teil gespeichert werden.'
                );
              else {
                const examPlan = getExamPlan();
                objectPath.set(
                  examPlan,
                  nestedKeys + '.nonMathSubjectName',
                  event.target.value
                ),
                  setExamPlan(examPlan);
              }
            }}
          />
          <FormHelperText>
            Hier {name} angeben (max. 100 Zeichen)
          </FormHelperText>
        </FormControl>
      )}
    </div>
  );
}
