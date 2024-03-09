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
} from '@mui/joy';
import { Box } from '@mui/material';
import { setExamPlan} from './examPlanVariable.ts';
import { AxiosError } from 'axios';
import { getExamRegulations } from '../../../intern/src/database_services/ExamRegulationService.ts';
import ExamPlanForm from './examPlanForm.tsx';

/**
 * 
 * @returns the UI for the start page of the exam plan form where when the user can select a exam regulation and a type of exam plan. After that, the actual exam plan form is shown
 */
export default function ExamPlanFormStartPage() {
  // the selected examRegulation
  const [examRegulation, setExamRegulation] = React.useState<{
    jsonSchema: string;
    name: string;
  }>({
    jsonSchema: '',
    name: ''
  });
  // "Prüfungsplan" or "Nebenfach"
  const [typeOfExamPlan, setTypeOfExamPlan] = React.useState<string | null>(
    null
  );
  // true if exam regulation has been chosen and exam plan initialized
  const [hasExamPlan, setHasExamPlan] = React.useState(false);
  // all exam regulation names from the database
  const [examRegulationNames, setExamRegulationNames] = React.useState<
    Array<string>
  >([]);
  // all exam regulations from the database
  const [examRegulations, setExamRegulations] = React.useState<
    Array<{ jsonSchema: string; name: string }>
  >([]);

  // on the first render the exam regulations are fetched from the database
  React.useEffect(() => {
    getExamRegulations()
      .then((responseData: { jsonSchema: string; name: string }[]) => {
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
      {hasExamPlan && typeOfExamPlan === "Prüfungsplan" && (
        <ExamPlanForm examRegulation={examRegulation}></ExamPlanForm>
      )}
    </>
  );
}
