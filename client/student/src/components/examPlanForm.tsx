import { setExamPlan, getExamPlan } from './examPlanVariable.ts';
import { saveExamPlan } from '../database_services/ExamPlanService.ts';
import { ExamPlanFormElement } from './examPlanFormElement.tsx';
import objectPath from 'object-path';
import { FormControl, FormLabel, Textarea } from '@mui/joy';
import { Button } from '@mui/material';

export default function ExamPlanForm({examRegulation}: {examRegulation: {
    jsonSchema: string;
    name: string;
  }}) {
    return <div style={{ minWidth: '900px' }}>
          {Object.entries(JSON.parse(examRegulation?.jsonSchema)).map(
            (entry) => (
              <ExamPlanFormElement entry={entry} nestedKeys={''} level={0} />
            )
          )}
          <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
            <FormLabel>
              Weitere Anmerkungen zum Prüfungs- bzw. Nebenfachplan (max. 5000
              Zeichen)
            </FormLabel>
            <Textarea
              minRows={4}
              maxRows={8}
              onChange={(event) => {
                if (event.target.value.length > 5000)
                  window.alert(
                    'Die Anmerkung ist zu lang, so kann nur ein Teil der Anmerkung gespeichert werden.'
                  );
                else {
                  const examPlan = getExamPlan();
                  objectPath.set(
                    examPlan,
                    'area.notesStudent',
                    event.target.value
                  ),
                    setExamPlan(examPlan);
                }
              }}
            />
          </FormControl>
          <Button
            variant="outlined"
            sx={{ marginTop: 2, marginBottom: 2 }}
            onClick={() => {
              saveExamPlan(
                JSON.stringify(getExamPlan()),
                examRegulation.name,
                "Prüfungsplan"
              )
                .then((response: { data: object }) => {
                  console.log(response.data);
                  window.alert(
                    'Der Entwurf wurde erfolgreich gespeichert.'
                  );
                })
                .catch((e: Error) => {
                  console.log('Error while saving examPlan');
                  console.log(e);
                });
            }}
          >
            Als Prüfungsplan-Entwurf speichern
          </Button>
        </div>
}