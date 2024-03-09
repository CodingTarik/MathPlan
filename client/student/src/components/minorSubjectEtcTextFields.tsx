import { FormControl, Textarea } from '@mui/joy';
import { setExamPlan, getExamPlan } from './examPlanVariable';
import objectPath from 'object-path';
import { FormHelperText } from '@mui/material';

const needsAdditionalInputFieldForName = [
  'Nebenfach',
  'Nicht-mathematischer Vertiefungsbereich'
];
const needsAdditionalInputFieldForModules = [
  'Nebenfach',
  'Nicht-mathematischer Vertiefungsbereich',
  'Studium Generale',
  'Nebenfach Wirtschaftsinformatik',
  'Nebenfach Informatik',
  'Nicht-mathematischer Vertiefungsbereich: Wirtschaftswissenschaften',
  'Module aus dem Nebenfach',
  'Module aus der gewählten nicht-mathematischen Vertiefung'
];

/**
 * 
 * @param name of  the area
 * @param nestedKeys the path to this subarea within the exam regulation object
 * @returns depending on the name of the area returns a input field for the name of e.g the minor or non-mathematical specialisation subject and a input field for the modules taken in that area
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
      {needsAdditionalInputFieldForModules.includes(name) && (
        <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
          <Textarea
            minRows={4}
            maxRows={8}
            onChange={(event) => {
              if (event.target.value.length > 1000)
                window.alert(
                  'Der Text ist zu lang, so kann nur ein Teil gespeichert werden.'
                );
              else {
                const examPlan = getExamPlan();
                objectPath.set(
                  examPlan,
                  nestedKeys + '.nonMathSubjectModules',
                  event.target.value
                ),
                  setExamPlan(examPlan);
              }
            }}
          />
          <FormHelperText>
            Tragen Sie hier alle Module mit CP, Name und Modulnummer ein, die
            Sie im Bereich {name} belegt haben und in Ihren Abschluss einbringen
            möchten (max. 1000 Zeichen)
          </FormHelperText>
        </FormControl>
      )}
    </div>
  );
}
