import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import React from 'react';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Box from '@mui/material/Box';
import Sheet from '@mui/joy/Sheet';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Typography from '@mui/joy/Typography';

export default function ApplicationForm() {
  const examRegulationNames = [
    'B.Sc. Mathematik 2018',
    'M.Sc. Mathematik 2015',
    'B.Sc. Mathematics 2017'
  ];
  const [examRegulation, setExamRegulation] = React.useState<{
    jsonSchema: string;
    name: string;
  } | null>(null);
  const [typeOfApplicationForm, setTypeOfApplicationForm] = React.useState<
    string | null
  >(null);
  const onRegulationChange = (name: string | null) => {
    if (name == null) throw Error();
    //todo: retrieve examRegulation from database
    name;
    examRegulation;
    typeOfApplicationForm
    setExamRegulation({
      jsonSchema: JSON.stringify({
        area: {
          name: 'Wahlbereich',
          module: [
            {
              name: {
                moduleID: '7695475',
                moduleName: 'Test Modul',
                moduleCredits: 3,
                moduleLanguage: 'English',
                moduleApplicability: 'Computer Science'
              },
              moduleID: '7695475',
              creditPoints: 3,
              pflicht: false,
              nichtwählbarmitmodul: []
            }
          ],
          minCreditPointsOverall: 190
        }
      }),
      name: name
    });
  };
  return (
    <>
      <h1>Antrag Detailansicht</h1>
      <Box sx={{ p:2 , border: 1  }}>
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
        Hinweis: Wenn im Master die Studienrichtung gewechselt wird, muss ein seperater Prüfungsplan ausgefüllt werden.
      </Typography>
      <RadioGroup
        size="lg"
        sx={{ gap: 1.5, mt: 2 }}
        orientation="horizontal"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setTypeOfApplicationForm(event.target.value)
        }
      >
        {['Prüfungsplan', 'Nebenfachplan'].map((value) => (
          <Sheet key={value} sx={{ p: 2, borderRadius: 'md', boxShadow: 'sm' }}>
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
    </>    
  );
}
