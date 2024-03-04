import * as React from 'react';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { TypographySystem, Select, Option, FormControl, FormLabel, Radio, RadioGroup, Sheet, Typography, Accordion, AccordionDetails, AccordionSummary, Table, Checkbox } from '@mui/joy';
import objectPath from 'object-path';
import { Button, Box } from '@mui/material';
import {descriptions} from './descriptions.ts'

type DescriptionsKey = keyof typeof descriptions;
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

function descendingComparator(a: ModulWrapper, b: ModulWrapper) {
  if (b['name']['moduleName'] < a['name']['moduleName']) {
    return -1;
  }
  if (b['name']['moduleName'] > a['name']['moduleName']) {
    return 1;
  }
  return 0;
}

function stableSort(
  array: readonly ModulWrapper[],
  comparator: (a: ModulWrapper, b: ModulWrapper) => number
) {
  const stabilizedThis = array.map(
    (el, index) => [el, index] as [ModulWrapper, number]
  );
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells: readonly string[] = ['Name', 'Nummer', 'CP', 'Sprache'];

function TableHead() {
  return (
    <thead>
      <tr>
        <th></th>
        {headCells.map((headCell) => {
          return <th>{headCell}</th>;
        })}
      </tr>
    </thead>
  );
}

function TableToolbar({
  numSelected,
  selected
}: {
  numSelected: number;
  selected: readonly ModulWrapper[];
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        py: 1,
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: 'background.level1'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} component="div">
          {numSelected} Modul(e) ausgewählt:{' '}
          {selected
            .map((x) => x['name']['moduleName'])
            .toString()
            .split(',')
            .join(', ')}
        </Typography>
      ) : (
        <Typography
          level="body-lg"
          sx={{ flex: '1 1 100%' }}
          component="div"
        ></Typography>
      )}
    </Box>
  );
}


let examPlan = new Object();

export default function ExamPlanForm() {
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
  const [displayExamPlan, setDisplayExamPlan] = React.useState(false);

  const examRegulationNames = [
    'B.Sc. Mathematik 2018',
    'M.Sc. Mathematik 2015'
  ];

  /**
   *
   * @param param0
   * @returns ui for the exam plsn
   */
  function Item({
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
                    <Item
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
                    <Item
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
            return (
              <div>
                <Accordion defaultExpanded={true}>
                  <AccordionSummary>
                    {Object.entries(e).map(
                      (newEntry) =>
                        newEntry[0] === 'name' && (
                          <Item
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
                          <Item
                            entry={newEntry}
                            nestedKeys={nestedKeys + key + '.' + index}
                            level={level + 1}
                          />
                        );
                      }
                    })}
                    {containsModules && (
                      <Item
                        entry={moduleEntry}
                        nestedKeys={nestedKeys + key + '.' + index}
                        level={level + 1}
                      />
                    )}
                    {containsSubarea && (
                      <Item
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
      const rows = value as ModulWrapper[];
      const [selected, setSelected] = React.useState<readonly ModulWrapper[]>(
        []
      );

      const handleClick = (
        _event: React.MouseEvent<unknown>,
        wrapper: ModulWrapper
      ) => {
        const selectedIndex = selected.indexOf(wrapper);
        let newSelected: readonly ModulWrapper[] = [];

        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selected, wrapper);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
          newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1)
          );
        }
        setSelected(newSelected);
        console.log(examPlan);

        if (newSelected !== null)
          objectPath.set(examPlan, nestedKeys, newSelected);
      };

      const isSelected = (wrapper: ModulWrapper) =>
        selected.indexOf(wrapper) !== -1;

      return (
        <Sheet
          variant="outlined"
          sx={{
            width: '100%',
            boxShadow: 'sm',
            borderRadius: 'sm',
            height: '300px',
            overflow: 'auto',
            mt: 2,
            mb: 2
          }}
        >
          <TableToolbar numSelected={selected.length} selected={selected} />
          <Table
            hoverRow
            sx={{
              '--TableCell-headBackground': 'transparent',
              '--TableCell-selectedBackground': (theme) =>
                theme.vars.palette.primary.softBg,
              '& thead th:nth-child(1)': {
                width: '40px'
              },
              '& thead th:nth-child(2)': {
                width: '40%'
              },
              '& thead th:nth-child(3)': {
                width: '20%'
              },
              '& thead th:nth-child(4)': {
                width: '13%'
              },
              '& tr > *:nth-child(n+3)': { textAlign: 'right' }
            }}
          >
            <TableHead />
            <tbody>
              {stableSort(rows, (a, b) => -descendingComparator(a, b)).map(
                (row) => {
                  const isItemSelected = isSelected(row);
                  return (
                    <tr
                      onClick={(event) => handleClick(event, row)}
                      style={
                        isItemSelected
                          ? ({
                              '--TableCell-dataBackground':
                                'var(--TableCell-selectedBackground)',
                              '--TableCell-headBackground':
                                'var(--TableCell-selectedBackground)'
                            } as React.CSSProperties)
                          : {}
                      }
                    >
                      <th scope="row">
                        <Checkbox
                          checked={isItemSelected}
                          sx={{ verticalAlign: 'top' }}
                        />
                      </th>
                      <td scope="row">
                        {' '}
                        <Typography level="title-sm">
                          {row.name.moduleName}
                        </Typography>
                      </td>
                      <td>{row.name.moduleID}</td>
                      <td>{row.name.moduleCredits}</td>
                      <td>{row.name.moduleLanguage}</td>
                    </tr>
                  );
                }
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      justifyContent: 'flex-end'
                    }}
                  ></Box>
                </td>
              </tr>
            </tfoot>
          </Table>
        </Sheet>
      );
    } else {
      return <div>Error loading component</div>;
    }
  }

  const onRegulationChange = (name: string | null) => {
    if (name == null) throw Error();
    //todo: retrieve examRegulation from database
    const x = {
      area: {
        name: 'B.Sc. Mathematik/Mathematik 2018',
        minCreditPointsOverall: 180,
        subarea: [
          { name: 'Pflichtbereich Mathematik', minCreditPointsOverall: 83 },
          { name: 'Seminar/Projekt', minCreditPointsSeminar: 5 },
          {
            name: 'Fachlicher Bereich',
            minCreditPointsOverall: 60,
            maxCreditPointsOverall: 63,
            subarea: [
              {
                name: 'Wahlpflichtbereich Mathematik ',
                description:
                  'Typ § 30 Abs. 6 mit uneingeschränktem Modulwechsel',
                subarea: [
                  {
                    name: 'Kernmodule',
                    description: 'Drei Module müssen belegt werden.',
                    subarea: [
                      {
                        name: 'Kernmodule Algebra, Analysis, Geometrie und Logik',
                        description:
                          'Ein Modul muss belegt werden. Weitere Module nach Genehmigung.',
                        minCreditPointsOverall: 9,
                        module: [
                          {
                            name: {
                              moduleID: '04-00-0029',
                              moduleName: 'Algebra',
                              moduleCredits: 9,
                              moduleLanguage: 'Deutsch',
                              moduleApplicability:
                                'Für B.Sc.Math, B.Sc.Math (bilingual), B.Sc.MCS, B.Sc.WiMa, B.Sc.ME: Wahlpflichtbereich. Für M.Sc.Math: Vertiefungsbereich. Für M.Sc.WiMa: Ergänzungsbereich.'
                            },
                            moduleID: '04-00-0029',
                            creditPoints: 9,
                            pflicht: false,
                            nichtwählbarmitmodul: []
                          },
                          {
                            name: {
                              moduleID: '04-00-0036',
                              moduleName: 'Funktionalanalysis',
                              moduleCredits: 9,
                              moduleLanguage: 'Deutsch',
                              moduleApplicability:
                                'Für B.Sc.Math, B.Sc.MCS, B.Sc.WiMa, B.Sc.ME: math. Wahlbereich Für M.Sc.Math, M.Sc.WiMa: Ergänzungsbereich wird in einigen Vertiefungen partielle Differentialgleichungen und in Algebra/ Geometrie/Funktionalanalysis vorausgesetzt.'
                            },
                            moduleID: '04-00-0036',
                            creditPoints: 9,
                            pflicht: false,
                            nichtwählbarmitmodul: []
                          },
                          {
                            name: {
                              moduleID: '04-10-0035/de',
                              moduleName: 'Differentialgeometrie',
                              moduleCredits: 5,
                              moduleLanguage: 'Deutsch',
                              moduleApplicability:
                                'Für B.Sc.Math math. Wahlbereich; Für Master: Ergänzungsbereich'
                            },
                            moduleID: '04-10-0035/de',
                            creditPoints: 5,
                            pflicht: false,
                            nichtwählbarmitmodul: []
                          },
                          {
                            name: {
                              moduleID: '04-00-0028',
                              moduleName: 'Introduction to Mathematical Logic',
                              moduleCredits: 9,
                              moduleLanguage: 'Englisch',
                              moduleApplicability:
                                'Für B.Sc.Math, B.Sc.Math (bilingual), B.Sc.MCS: A* Für B.Sc.WiMa, B.Sc.ME: math Wahlpflichtbereich Für M.Sc.Math, M.Sc.WiMa: Ergänzungsbereich'
                            },
                            moduleID: '04-00-0028',
                            creditPoints: 9,
                            pflicht: false,
                            nichtwählbarmitmodul: []
                          }
                        ],
                        maxCreditPointsOverall: 28
                      },
                      {
                        name: 'Kernmodule Numerik, Optimierung und Stochastik',
                        description:
                          'Ein Modul muss belegt werden. Weitere Module nach Genehmigung.',
                        minCreditPointsOverall: 9,
                        maxCreditPointsOverall: 28,
                        module: [
                          {
                            name: {
                              moduleID: '04-10-0393/de',
                              moduleName:
                                'Numerik Gewöhnlicher Differentialgleichungen',
                              moduleCredits: 9,
                              moduleLanguage: 'Deutsch',
                              moduleApplicability:
                                'B.Sc. Mathematik, M.Sc Mathematik, M.Sc. Mathematics (nicht zusammen mit 04-10- 0042/de belegbar)'
                            },
                            moduleID: '04-10-0393/de',
                            creditPoints: 9,
                            pflicht: false,
                            nichtwählbarmitmodul: []
                          },
                          {
                            name: {
                              moduleID: '04-00-0040',
                              moduleName: 'Einführung in die Optimierung',
                              moduleCredits: 9,
                              moduleLanguage: 'Deutsch',
                              moduleApplicability:
                                'Für B.Sc.WiMa, B.Sc.Mamp;E: Pflicht Für B.Sc.Math, B.Sc.MCS: Wahlpflichtbereich Mathematik (C*) Für M.Sc.Math: Ergänzungsbereich Für B.Sc.CE: als mathematisches Wahlmodul wird in der Mastervertiefung Optimierung vorausgesetzt'
                            },
                            moduleID: '04-00-0040',
                            creditPoints: 9,
                            pflicht: false,
                            nichtwählbarmitmodul: []
                          },
                          {
                            name: {
                              moduleID: '04-00-0046',
                              moduleName: 'Probability Theory',
                              moduleCredits: 9,
                              moduleLanguage: 'Englisch',
                              moduleApplicability:
                                'Für B.Sc.WiMa, B.Sc.ME: Pflicht Für B.Sc.Math, B.Sc.MCS: Wahlpflichtbereich Mathematik (D*) Für M.Sc.Math: Ergänzungsbereich Für B.Sc.CE: im mathematischen Wahlpflichtbereich A Für M.Sc.CE: Bereich 1B wird in der Mastervertiefung Stochastik vorausgesetzt.'
                            },
                            moduleID: '04-00-0046',
                            creditPoints: 9,
                            pflicht: false,
                            nichtwählbarmitmodul: []
                          }
                        ]
                      },
                      {
                        name: 'Weitere Module',
                        description:
                          'Weitere Module nach Modulhandbuch (Wahlpflichtbereich Mathematik) oder nach Genehmigung.',
                        minCreditPointsOverall: 0,
                        maxCreditPointsOverall: 10,
                        module: [
                          {
                            name: {
                              moduleID: '04-11-0031/de',
                              moduleName: 'Topologie',
                              moduleCredits: 5,
                              moduleLanguage: 'Deutsch',
                              moduleApplicability:
                                'B.Sc. Mathematik, M.Sc Mathematik, M.Sc. Mathematics'
                            },
                            moduleID: '04-11-0031/de',
                            creditPoints: 5,
                            pflicht: false,
                            nichtwählbarmitmodul: []
                          },
                          {
                            name: {
                              moduleID: '04-10-0565/en',
                              moduleName: 'Real and complex manifolds',
                              moduleCredits: 9,
                              moduleLanguage: 'Englisch',
                              moduleApplicability:
                                'B.Sc. Mathematik, M.Sc Mathematik, M.Sc. Mathematics'
                            },
                            moduleID: '04-10-0565/en',
                            creditPoints: 9,
                            pflicht: false,
                            nichtwählbarmitmodul: []
                          },
                          {
                            name: {
                              moduleID: '04-10-0120/de',
                              moduleName:
                                'Automaten, formale Sprachen und Entscheidbarkeit',
                              moduleCredits: 5,
                              moduleLanguage: 'Deutsch',
                              moduleApplicability:
                                'Pflichtveranstaltung in Informatik-Studiengängen; Bestandteil des Moduls "Formale Grundlagen der Imformatik" im BSc Mathematik'
                            },
                            moduleID: '04-10-0120/de',
                            creditPoints: 5,
                            pflicht: false,
                            nichtwählbarmitmodul: []
                          },
                          {
                            name: {
                              moduleID: '04-10-0043/de',
                              moduleName: 'Numerische Lineare Algebra',
                              moduleCredits: 5,
                              moduleLanguage: 'Deutsch',
                              moduleApplicability:
                                'B.Sc. Mathematik, M.Sc Mathematik, M.Sc. Mathematics M.Sc. ETIT'
                            },
                            moduleID: '04-10-0043/de',
                            creditPoints: 5,
                            pflicht: false,
                            nichtwählbarmitmodul: []
                          },
                          {
                            name: {
                              moduleID: '04-00-0034',
                              moduleName: 'Diskrete Mathematik',
                              moduleCredits: 9,
                              moduleLanguage: 'Deutsch',
                              moduleApplicability: ''
                            },
                            moduleID: '04-00-0034',
                            creditPoints: 9,
                            pflicht: false,
                            nichtwählbarmitmodul: []
                          },
                          {
                            name: {
                              moduleID: '04-00-0281',
                              moduleName: 'Spieltheorie',
                              moduleCredits: 6,
                              moduleLanguage: 'Deutsch',
                              moduleApplicability:
                                'B.Sc.Math:Wahlpflichtbereich, Ergänzungsbereich'
                            },
                            moduleID: '04-00-0312',
                            creditPoints: 6,
                            pflicht: false,
                            nichtwählbarmitmodul: []
                          },
                          {
                            name: {
                              moduleID: '04-10-0047/de',
                              moduleName: 'Einführung in die Finanzmathematik',
                              moduleCredits: 5,
                              moduleLanguage: 'Deutsch',
                              moduleApplicability:
                                'B.Sc. Mathematik, M.Sc Mathematik, M.Sc. Mathematics'
                            },
                            moduleID: '04-10-0047/de',
                            creditPoints: 5,
                            pflicht: false,
                            nichtwählbarmitmodul: []
                          }
                        ]
                      }
                    ],
                    minCreditPointsOverall: 27,
                    maxCreditPointsOverall: 37
                  }
                ],
                minCreditPointsOverall: 32,
                maxCreditPointsOverall: 37
              }
            ]
          },
          {
            name: 'Nebenfach',
            description:
              'Typ § 30 Abs. 4 mit einmaligen Nebenfachwechsel aus wichtigem Grund.\nEs ist ein Nebenfach zu wählen. Nebenfächer und Informationen unter www.mathematik.tu-darmstadt.de/nebenfach.',
            minCreditPointsOverall: 26,
            maxCreditPointsOverall: 31
          },
          {
            name: 'Überfachlicher Bereich',
            subarea: [
              {
                name: 'Überfachlicher Pflichtbereich',
                minCreditPointsOverall: 9
              },
              {
                name: 'Überfachlicher Wahlbereich',
                minCreditPointsOverall: 5,
                maxCreditPointsOverall: 8,
                subarea: [
                  {
                    name: 'Mathematische Allgemeinbildung',
                    description: 'Weitere Module nach Genehmigung.',
                    minCreditPointsOverall: 5,
                    maxCreditPointsOverall: 8,
                    module: [
                      {
                        name: {
                          moduleID: '04-10-0044/de',
                          moduleName:
                            'Einführung in die Mathematische Modellierung',
                          moduleCredits: 5,
                          moduleLanguage: 'Deutsch',
                          moduleApplicability:
                            'B.Sc. Mathematik, LaG Mathematik'
                        },
                        moduleID: '04-10-0044/de',
                        creditPoints: 5,
                        pflicht: false,
                        nichtwählbarmitmodul: []
                      },
                      {
                        name: {
                          moduleID: '04-10-0021/de',
                          moduleName: 'Logik und Grundlagen',
                          moduleCredits: 3,
                          moduleLanguage: 'Deutsch',
                          moduleApplicability:
                            'B.Sc. Mathematik, Wahlpflichtbereich Ü'
                        },
                        moduleID: '04-10-0021/de',
                        creditPoints: 3,
                        pflicht: false,
                        nichtwählbarmitmodul: []
                      },
                      {
                        name: {
                          moduleID: '04-10-0023/de',
                          moduleName: 'Mathematik im Kontext',
                          moduleCredits: 3,
                          moduleLanguage: 'Deutsch',
                          moduleApplicability:
                            'B.Sc. Mathematik, Wahlpflichtbereich Ü'
                        },
                        moduleID: '04-10-0023/de',
                        creditPoints: 3,
                        pflicht: false,
                        nichtwählbarmitmodul: []
                      },
                      {
                        name: {
                          moduleID: '04-10-0086/de',
                          moduleName: 'Lehren und Lernen von Mathematik',
                          moduleCredits: 6,
                          moduleLanguage: 'Deutsch',
                          moduleApplicability: 'B.Sc. Mathematik'
                        },
                        moduleID: '04-10-0086/de',
                        creditPoints: 6,
                        pflicht: false,
                        nichtwählbarmitmodul: []
                      }
                    ]
                  },
                  {
                    name: 'Mathematisches Handwerkszeug',
                    description: 'Weitere Module nach Genehmigung.',
                    minCreditPointsOverall: 0,
                    maxCreditPointsOverall: 3,
                    module: [
                      {
                        name: {
                          moduleID: '41-21-0922',
                          moduleName: 'English Paternoster for Mathematicians',
                          moduleCredits: 3,
                          moduleLanguage: 'english',
                          moduleApplicability:
                            'B.Sc. Mathematik, M.Sc. Mathematik'
                        },
                        moduleID: '41-21-0922',
                        creditPoints: 3,
                        pflicht: false,
                        nichtwählbarmitmodul: []
                      },
                      {
                        name: {
                          moduleID: '41-21-0382',
                          moduleName: 'English for Mathematicians',
                          moduleCredits: 3,
                          moduleLanguage: 'english',
                          moduleApplicability: 'B.Sc. Mathematik'
                        },
                        moduleID: '41-21-0382',
                        creditPoints: 3,
                        pflicht: false,
                        nichtwählbarmitmodul: []
                      },
                      {
                        name: {
                          moduleID: '04-10-0398/de',
                          moduleName: 'Interdisziplinäres Projekt',
                          moduleCredits: 2,
                          moduleLanguage: 'Deutsch',
                          moduleApplicability: 'B.Sc. Mathematik'
                        },
                        moduleID: '04-10-0398/de',
                        creditPoints: 2,
                        pflicht: false,
                        nichtwählbarmitmodul: []
                      }
                    ]
                  }
                ]
              },
              {
                name: 'Studium Generale',
                description:
                  'Gesamtkatalog aller Module der TU Darmstadt. Ausgenommen sind Veranstaltungen des Fachbereichs Mathematik und des Nebenfachs, sofern sie nicht ausschließlich als Studium Generale wählbar sind. Module mathematischen Inhalts, welcher in vergleichbarer Form auch in Modulen des Fachbereichs Mathematik abgedeckt wird, sind ebenfalls ausgeschlossen.',
                minCreditPointsOverall: 3,
                maxCreditPointsOverall: 6
              }
            ]
          },
          {
            name: 'Abschlussarbeit',
            minCreditPointsOverall: 12,
            maxCreditPointsOverall: 12
          }
        ]
      }
    };
    setExamRegulation({
      jsonSchema: JSON.stringify(x),
      name: 'B'
    });
    //setExamPlan(x);
    examPlan = x;
    console.log(examPlan);
    if (typeOfExamPlan !== null) {
      //todo: change somehow if nebenfach plan selected
      setDisplayExamPlan(true);
    }
    //todo: delete if relevant whether nebenfach or prüfungsplan
    setDisplayExamPlan(true);
  };

  return (
    <>
      <h1>Antrag Detailansicht</h1>
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
          Hinweis: Wenn im Master die Studienrichtung gewechselt wird, muss ein
          seperater Prüfungsplan ausgefüllt werden.
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
      <div>
        {displayExamPlan &&
          Object.entries(JSON.parse(examRegulation?.jsonSchema)).map(
            (entry) => <Item entry={entry} nestedKeys={''} level={0} />
          )}
        <Button
          variant="outlined"
          sx={{ marginTop: 2, marginBottom: 2 }}
          onClick={() => console.log(examPlan)}
        >
          Submit
        </Button>
      </div>
    </>
  );
}
