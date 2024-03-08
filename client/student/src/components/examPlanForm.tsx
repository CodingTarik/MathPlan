import { descriptions } from './descriptions.ts';
import TableForModules from './tableForModules.tsx';
import { setExamPlan, getExamPlan } from './examPlanVariable.ts';
import {
  TypographySystem,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary
} from '@mui/joy';
import ExternalModules from './externalModules.tsx';
import MinorSubjectTextFields from './minorSubjectTextFields.tsx';
import { Box } from '@mui/material';
import objectPath from 'object-path';
import Markdown from 'react-markdown';

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
 * @param entry key value pair that is part of the exam regulation
 * @param nestedKeys the path to this key value pair within the exam regulation object
 * @param level the depth at which the key value pair can be found in the exam regulation
 * @returns UI for the actual exam plan form
 */
function ExamPlanForm({
  entry,
  nestedKeys,
  level
}: {
  entry: Array<string | unknown>;
  nestedKeys: string;
  level: number;
}) {
  // type of titles at different levels
  const levels = ['h1', 'h2', 'h3', 'h4', 'title-lg'];
  // key-value pair
  const key = entry[0] as string;
  const value = entry[1];
  if (nestedKeys) {
    nestedKeys = nestedKeys + '.' + key;
  }
  if (key === 'area') {
    /** recursively call ExamPlanForm for every key-value pair in the value object, the key-value pair that contains the name of the exam regulation is the key-value pair which is passed as a
     * param for the first function call since it is the accordion summary (part that is still visible is accordion is not expanded)
     */
    return (
      <Box sx={{ p: 4, border: 1, borderRadius: 2, mt: 2 }}>
        <Accordion defaultExpanded={true}>
          <AccordionSummary>
            {Object.entries(value as object).map(
              (newEntry) =>
                newEntry[0] === 'name' && (
                  <ExamPlanForm
                    entry={newEntry}
                    nestedKeys={nestedKeys}
                    level={level + 1}
                  />
                )
            )}
          </AccordionSummary>
          <AccordionDetails>
            {Object.entries(value as object).map(
              (newEntry) =>
                newEntry[0] !== 'name' && (
                  <ExamPlanForm
                    entry={newEntry}
                    nestedKeys={nestedKeys}
                    level={level + 1}
                  />
                )
            )}
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  } else if (key === 'subarea') {
    /** For every subarea in the value array recursively call ExamPlanForm for every key-value pair in the subarea object.
     * If a subarea contains more subareas or modules that ExamPlanForm call is done at the end, so that the order of the UI components is always the same.
     */
    return (
      <Box sx={{ border: 0.5, borderRadius: 2, ml: 8, p: 3, mt: 2, mb: 2 }}>
        {(value as Array<object>).map((e: object, index: number) => {
          let containsModules = false;
          let moduleEntry = new Array<string | unknown>();
          let containsSubarea = false;
          let subareaEntry = new Array<string | unknown>();
          let nameSubarea = '';
          return (
            <div>
              <Accordion defaultExpanded={true}>
                <AccordionSummary>
                  {Object.entries(e).map(
                    (newEntry) =>
                      newEntry[0] === 'name' && (
                        <ExamPlanForm
                          entry={newEntry}
                          nestedKeys={nestedKeys + '.' + index}
                          level={level + 1}
                        />
                      )
                  )}
                </AccordionSummary>
                <AccordionDetails>
                  {Object.entries(e).map((newEntry) => {
                    if (newEntry[0] === 'name') {
                      nameSubarea = newEntry[1];
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
                        <ExamPlanForm
                          entry={newEntry}
                          nestedKeys={nestedKeys + '.' + index}
                          level={level + 1}
                        />
                      );
                    }
                  })}

                  {containsModules && (
                    <ExamPlanForm
                      entry={moduleEntry}
                      nestedKeys={nestedKeys + '.' + index}
                      level={level + 1}
                    />
                  )}

                  <ExternalModules
                    name={nameSubarea}
                    nestedKeys={nestedKeys + '.' + index}
                  ></ExternalModules>

                  <MinorSubjectTextFields
                    name={nameSubarea}
                    nestedKeys={nestedKeys + '.' + index}
                  ></MinorSubjectTextFields>

                  {containsSubarea && (
                    <ExamPlanForm
                      entry={subareaEntry}
                      nestedKeys={nestedKeys + '.' + index}
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
    // the information contained in the exam regulation like minNumberSeminars,.. is rendered as markdown with a descriptive string as specified in descriptions.ts
    return (
      <div style={{ textAlign: 'left' }}>
        <Markdown>
          {(descriptions[key as DescriptionsKey] + value) as string}
        </Markdown>
      </div>
    );
  } else if (key === 'name') {
    // depending on the level the name is rendered as a certain style of title
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
    // initially no modules are stored in each area, this is set in the exam plan variable
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

export { ExamPlanForm };
