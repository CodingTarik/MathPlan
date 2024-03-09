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
import MinorSubjectEtcTextFields from './minorSubjectEtcTextFields.tsx';
import { Box } from '@mui/material';
import objectPath from 'object-path';
import Markdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';

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

function AreaCase({
  value,
  nestedKeys,
  level
}: {
  value: object;
  nestedKeys: string;
  level: number;
}) {
  /** recursively call ExamPlanForm for every key-value pair in the value object, the key-value pair that contains the name of the exam regulation is the key-value pair which is passed as a
   * param for the first function call since it is the accordion summary (part that is still visible is accordion is not expanded)
   */
  return (
    <Box sx={{ p: 4, border: 1, borderRadius: 2, mt: 2 }}>
      <Accordion defaultExpanded={true}>
        <AccordionSummary>
          {Object.entries(value).map(
            (newEntry) =>
              newEntry[0] === 'name' && (
                <ExamPlanFormElement
                  entry={newEntry}
                  nestedKeys={nestedKeys}
                  level={level + 1}
                />
              )
          )}
        </AccordionSummary>
        <AccordionDetails>
          {Object.entries(value).map(
            (newEntry) =>
              newEntry[0] !== 'name' && (
                <ExamPlanFormElement
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
}
function SubareaCase({
  value,
  nestedKeys,
  level
}: {
  value: Array<object>;
  nestedKeys: string;
  level: number;
}) {
  /** For every subarea in the value array recursively call ExamPlanForm for every key-value pair in the subarea object.
   * If a subarea contains more subareas or modules that ExamPlanForm call is done at the end, so that the order of the UI components is always the same.
   */
  return (
    <Box sx={{ border: 0.5, borderRadius: 2, ml: 8, p: 3, mt: 2, mb: 2 }}>
      {value.map((e: object, index: number) => {
        // we want to save whether or not this subarea contains a module area and that area so that it can be rendered after the descriptive strings such as maxSeminarCount etc.
        let containsModules = false;
        let moduleEntry = new Array<string | unknown>();

        // we want to save whether or not this subarea contains further subarea and that subarea entry so that it can be rendered after everything else in this subarea
        let containsSubarea = false;
        let subareaEntry = new Array<string | unknown>();

        // we save the name of this subarea so that it can be used by ExternalModules and MinorSubjectEtcTextFields
        let nameSubarea = '';
        return (
          <div>
            <Accordion defaultExpanded={true}>
              <AccordionSummary>
                {Object.entries(e).map(
                  (newEntry) =>
                    newEntry[0] === 'name' && (
                      <ExamPlanFormElement
                        entry={newEntry}
                        nestedKeys={nestedKeys + '.' + index}
                        level={level + 1}
                      />
                    )
                )}
              </AccordionSummary>
              <AccordionDetails>
                {Object.entries(e).map((newEntry) => {
                  switch(newEntry[0]){
                    case 'name':
                      nameSubarea = newEntry[1];
                      return;
                    case 'module':
                      containsModules = true;
                      moduleEntry = newEntry;
                      return;
                    case 'subarea':
                      containsSubarea = true;
                      subareaEntry = newEntry;
                      return;
                    default: 
                      return (
                        <ExamPlanFormElement
                          entry={newEntry}
                          nestedKeys={nestedKeys + '.' + index}
                          level={level + 1}
                        />
                      );
                  }
                })}

                {containsModules && (
                  <ExamPlanFormElement
                    entry={moduleEntry}
                    nestedKeys={nestedKeys + '.' + index}
                    level={level + 1}
                  />
                )}

                <ExternalModules
                  name={nameSubarea}
                  nestedKeys={nestedKeys + '.' + index}
                ></ExternalModules>

                <MinorSubjectEtcTextFields
                  name={nameSubarea}
                  nestedKeys={nestedKeys + '.' + index}
                ></MinorSubjectEtcTextFields>

                {containsSubarea && (
                  <ExamPlanFormElement
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
}

/**
 *
 * @param entry key value pair that is part of the exam regulation
 * @param nestedKeys the path to this key value pair within the exam regulation object
 * @param level the depth at which the key value pair can be found in the exam regulation
 * @returns UI for the actual exam plan form
 */
function ExamPlanFormElement({
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
  const levelTitle = level < 5 ? levels[level] : levels[4];
  // key-value pair
  const key = entry[0] as string;
  const value = entry[1];
  const examPlan = getExamPlan();
  if (nestedKeys) {
    nestedKeys = nestedKeys + '.' + key;
  }
  switch (key) {
    case 'area':
      return (
        <AreaCase
          value={value as object}
          nestedKeys={nestedKeys}
          level={level}
        ></AreaCase>
      );
    case 'subarea':
      return (
        <SubareaCase
          value={value as Array<object>}
          nestedKeys={nestedKeys}
          level={level}
        ></SubareaCase>
      );
    case 'name':
      // depending on the level the name is rendered as a certain style of title
      return (
        <Typography
          textAlign="left"
          level={levelTitle as keyof TypographySystem}
          sx={{ mb: 1, mt: 2 }}
        >
          {value as string}
        </Typography>
      );
    case 'module':
      // initially no modules are stored in each area, this is set in the exam plan variable
      objectPath.set(examPlan, nestedKeys, []);
      setExamPlan(examPlan);
      return (
        <TableForModules rows={value as ModulWrapper[]} nestedKeys={nestedKeys}></TableForModules>
      );
    default:
      if (Object.keys(descriptions).includes(key)) {
        // the information contained in the exam regulation like minNumberSeminars,.. is rendered as markdown with a descriptive string as specified in descriptions.ts
        return (
          <div style={{ textAlign: 'left' }}>
            <Markdown
              rehypePlugins={[[rehypeExternalLinks, { target: '_blank' }]]}
            >
              {(descriptions[key as DescriptionsKey] + value) as string}
            </Markdown>
          </div>
        );
      } else {
        return <div>Error loading component</div>;
      }
  }
}

export { ExamPlanFormElement };
