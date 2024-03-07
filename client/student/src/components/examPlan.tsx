import { descriptions } from './descriptions.ts';
import TableForModules from './tableForModules.tsx';
import { setExamPlan, getExamPlan } from './examPlanVariable';
import {
  TypographySystem,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary
} from '@mui/joy';
import ExternalModules from './externalModules';
import MinorSubjectTextFields from './minorSubjectTextFields.tsx';
import { Box } from '@mui/material';
import objectPath from 'object-path';

type Modul = {
  moduleID: string;
  moduleName: string;
  moduleCredits: string;
  moduleLanguage: string;
  moduleApplicability: string;
};
type ModulWrapper = {
  name: Modul;
  moduleID: string;
  creditPoints: number;
  pflicht: boolean;
  nichtwählbarmitmodul: Array<object>;
};

type DescriptionsKey = keyof typeof descriptions;

/**
 *
 * @param param0
 * @returns ui for the exam plsn
 */
function PlanForm({
  entry,
  nestedKeys,
  level
}: {
  entry: Array<string | unknown>;
  nestedKeys: string;
  level: number;
}) {
  const levels = ['h1', 'h2', 'h3', 'h4', 'title-lg'];
  const key = entry[0] as string;
  const value = entry[1];
  if (nestedKeys) {
    nestedKeys = nestedKeys + '.';
  }
  if (key === 'area') {
    return (
      <Box sx={{ p: 4, border: 1, borderRadius: 2, mt: 2 }}>
        <Accordion defaultExpanded={true}>
          <AccordionSummary>
            {Object.entries(value as object).map(
              (newEntry) =>
                newEntry[0] === 'name' && (
                  <PlanForm
                    entry={newEntry}
                    nestedKeys={nestedKeys + key}
                    level={level + 1}
                  />
                )
            )}
          </AccordionSummary>
          <AccordionDetails>
            {Object.entries(value as object).map(
              (newEntry) =>
                newEntry[0] !== 'name' && (
                  <PlanForm
                    entry={newEntry}
                    nestedKeys={nestedKeys + key}
                    level={level + 1}
                  />
                )
            )}
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  } else if (key === 'subarea') {
    return (
      <Box sx={{ border: 0.5, borderRadius: 2, ml: 8, p: 3, mt: 2, mb: 2 }}>
        {(value as Array<object>).map((e: object, index: number) => {
          let containsModules = false;
          let moduleEntry = new Array<string | unknown>();
          let containsSubarea = false;
          let subareaEntry = new Array<string | unknown>();
          let isMandotoryArea = false;
          let minorSubjectArea = false;
          return (
            <div>
              <Accordion defaultExpanded={true}>
                <AccordionSummary>
                  {Object.entries(e).map(
                    (newEntry) =>
                      newEntry[0] === 'name' && (
                        <PlanForm
                          entry={newEntry}
                          nestedKeys={nestedKeys + key + '.' + index}
                          level={level + 1}
                        />
                      )
                  )}
                </AccordionSummary>
                <AccordionDetails>
                  {Object.entries(e).map((newEntry) => {
                    if (newEntry[0] === 'name') {
                      if (newEntry[1].includes('Pflichtbereich')) {
                        isMandotoryArea = true;
                      }
                      if (newEntry[1].includes('Nebenfach') || newEntry[1].includes('Nicht-mathematischer Vertiefungsbereich')){
                        minorSubjectArea = true;
                      }
                      return;
                    } else if (newEntry[0] === 'module') {
                      containsModules = true;
                      moduleEntry = newEntry;
                      return;
                    } else if (newEntry[0] === 'subarea') {
                      containsSubarea = true;
                      subareaEntry = newEntry;
                      return;
                    } else {
                      return (
                        <PlanForm
                          entry={newEntry}
                          nestedKeys={nestedKeys + key + '.' + index}
                          level={level + 1}
                        />
                      );
                    }
                  })}

                  {containsModules && (
                    <PlanForm
                      entry={moduleEntry}
                      nestedKeys={nestedKeys + key + '.' + index}
                      level={level + 1}
                    />
                  )}
                  {!isMandotoryArea && (
                    <ExternalModules
                      nestedKeys={nestedKeys + key + '.' + index}
                    ></ExternalModules>
                  )}
                  {minorSubjectArea && (<MinorSubjectTextFields nestedKeys={nestedKeys + key + '.' + index}></MinorSubjectTextFields>)}
                  
                  {containsSubarea && (
                    <PlanForm
                      entry={subareaEntry}
                      nestedKeys={nestedKeys + key + '.' + index}
                      level={level + 1}
                    />
                  )}
                </AccordionDetails>
              </Accordion>
            </div>
          );
        })}
      </Box>
    );
  } else if (Object.keys(descriptions).includes(key)) {
    return (
      <Typography textAlign="left" level="body-md">
        {descriptions[key as DescriptionsKey]}
        {value as string}
      </Typography>
    );
  } else if (key === 'name') {
    const levelTitle = level < 5 ? levels[level] : levels[4];
    return (
      <Typography
        textAlign="left"
        level={levelTitle as keyof TypographySystem}
        sx={{ mb: 1, mt: 2 }}
      >
        {value as string}
      </Typography>
    );
  } else if (key === 'module') {
    nestedKeys = nestedKeys + 'module';
    const examPlan = getExamPlan();
    objectPath.set(examPlan, nestedKeys, []);
    setExamPlan(examPlan);
    const rows = value as ModulWrapper[];
    return (
      <TableForModules rows={rows} nestedKeys={nestedKeys}></TableForModules>
    );
  } else {
    return <div>Error loading component</div>;
  }
}

export { PlanForm };
