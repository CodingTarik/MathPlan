import * as React from 'react';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import {
  Select,
  Option,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Sheet,
  Typography,
  Textarea
} from '@mui/joy';
import { Button, Box } from '@mui/material';
import { ExamPlanForm } from './examPlanForm.tsx';
import { setExamPlan, getExamPlan } from './examPlanVariable.ts';
import objectPath from 'object-path';
import { AxiosError } from 'axios';
import { getExamRegulations } from '../../../intern/src/database_services/ExamRegulationService.ts';
import { saveExamPlan } from '../database_services/ExamPlanService.ts';

/**
 * 
 * @returns the UI for the start page of the exam plan form where when the user selects a exam regulation and a type of exam plan the actual exam plan form is shown
 */
export default function ExamPlanFormStartPage() {
  const [examRegulation, setExamRegulation] = React.useState<{
    jsonSchema: string;
    name: string;
  }>({
    jsonSchema: '',
    name: ''
  });
  const [typeOfExamPlan, setTypeOfExamPlan] = React.useState<string | null>(
    null
  );
  const [hasExamPlan, setHasExamPlan] = React.useState(false);
  const [examRegulationNames, setExamRegulationNames] = React.useState<
    Array<string>
  >([]);
  const [examRegulations, setExamRegulations] = React.useState<
    Array<{ jsonSchema: string; name: string }>
  >([]);

  // on the first render the exam regulations are fetched from the database
  React.useEffect(() => {
    getExamRegulations()
      .then((responseData: { jsonSchema: string; name: string }[]) => {
        console.log('Success at getting exam Regulations');
        setExamRegulationNames(responseData.map((entry) => entry.name));
        setExamRegulations(responseData);
      })
      .catch((e: AxiosError) => {
        console.log(e);
      });
  }, []);

  /**
   * the exam regulation the user has selected is chosen from the previously fetched exam regulations and the exam plan initially set
   * @param name of the exam regulation that the user has selecteds
   */
  const onRegulationChange = (name: string | null) => {
    if (name == null) throw Error();
    const x = examRegulations.find((elem) => elem.name === name);
    if (x) {
      setExamRegulation(x);
      setExamPlan(JSON.parse(x.jsonSchema));
      setHasExamPlan(true);
    }
  };

  return (
    <>
      <h1>Antrag Detailansicht</h1>
      {(!hasExamPlan || typeOfExamPlan === null) && (
        <Box sx={{ p: 2, border: 1, borderRadius: 2 }}>
          <FormControl sx={{ width: 300 }}>
            <FormLabel>Prüfungsordnung</FormLabel>
            <Select
              placeholder="Wählen Sie eine Prüfungsordnung"
              sx={{ width: 300 }}
              onChange={(
                _event: React.SyntheticEvent | null,
                newValue: string | null
              ) => {
                onRegulationChange(newValue);
              }}
            >
              {examRegulationNames.map((name) => (
                <Option value={name}>{name}</Option>
              ))}
            </Select>
          </FormControl>
          <Typography
            variant="soft"
            color="primary"
            level="body-md"
            startDecorator={<InfoOutlined />}
            sx={{ mt: 2, p: 2 }}
          >
            Hinweis: Wenn im Master die Studienrichtung gewechselt wird, muss
            ein seperater Prüfungsplan ausgefüllt werden.
          </Typography>
          <RadioGroup
            size="lg"
            sx={{ gap: 1.5, mt: 2 }}
            orientation="horizontal"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setTypeOfExamPlan(event.target.value)
            }
          >
            {['Prüfungsplan', 'Nebenfachplan'].map((value) => (
              <Sheet
                key={value}
                sx={{ p: 2, borderRadius: 'md', boxShadow: 'sm' }}
              >
                <Radio
                  label={`${value}`}
                  overlay
                  disableIcon
                  value={value}
                  slotProps={{
                    label: ({ checked }) => ({
                      sx: {
                        fontWeight: 'lg',
                        fontSize: 'md',
                        color: checked ? 'text.primary' : 'text.secondary'
                      }
                    }),
                    action: ({ checked }) => ({
                      sx: (theme) => ({
                        ...(checked && {
                          '--variant-borderWidth': '2px',
                          '&&': { borderColor: theme.vars.palette.primary[500] }
                        })
                      })
                    })
                  }}
                />
              </Sheet>
            ))}
          </RadioGroup>
        </Box>
      )}
      {hasExamPlan && typeOfExamPlan && (
        <div style={{ minWidth: '900px' }}>
          {Object.entries(JSON.parse(examRegulation?.jsonSchema)).map(
            (entry) => (
              <ExamPlanForm entry={entry} nestedKeys={''} level={0} />
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
                typeOfExamPlan
              )
                .then((response: { data: object }) => {
                  console.log('Success at saving examPlan');
                  console.log(response.data);
                })
                .catch((e: Error) => {
                  console.log('Error while saving examPlan');
                  console.log(e);
                });
              window.alert(
                'Der ' +
                  { typeOfExamPlan } +
                  '-Entwurf wurde erfolgreich gespeichert.'
              );
              console.log(getExamPlan());
            }}
          >
            Als {typeOfExamPlan}-Entwurf speichern
          </Button>
        </div>
      )}
    </>
  );
}
