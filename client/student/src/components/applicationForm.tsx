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
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary from '@mui/joy/AccordionSummary';
import { Chip } from '@mui/joy';
import {produce} from "immer";
import objectPath from 'object-path';

/**
 * strings to be displayed for each property of an exam regulation
 */
const descriptions = {
  description: "",
  minCreditPointsOverall: "Diese Anzahl an CP muss minimal erbracht werden in diesem Bereich: ",
  maxCreditPointsOverall: "Diese Anzahl an CP muss maximal erbracht werden in diesem Bereich: ",
  minCreditPointsPraktikum: "Die minimale Anzahl an CP, die für Praktika in diesem Bereich erbracht werden kann: ",
  maxCreditPointsPraktikum: "Die maximale Anzahl an CP, die für Praktika in diesem Bereich erbracht werden kann: ",
  minCreditPointsSeminar: "Diese Anzahl an CP wird minimal für Seminare in diesem Bereich benötigt: ",
  maxCreditPointsSeminar: "Die maximale Anzahl an CP, die für Seminare in diesem Bereich erlaubt ist: ",
  minCreditPointsVorlesung: "Diese Anzahl an CP wird minimal für Vorlesungen in diesem Bereich benötigt: ",
  maxCreditPointsVorlesung: "Die maximale Anzahl an CP, die für Vorlesungen in diesem Bereich erlaubt ist: ",
  minSubAreaCheck: "Die minimale Anzahl an Unterbereichen, dessen Anforderungen in diesem Bereich erfüllt werden müssen: ",
  maxSubAreaCheck: "Die maximale Anzahl an Unterbereichen, dessen Anforderungen in diesem Bereich erfüllt werden müssen: ",
  minSeminarsCount: "Diese Anzahl an Seminaren kann minimal in diesem Bereich erbracht werden: ",
  minSeminarsCP: "Die minimale Anzahl an CP, die für Seminare in diesem Bereich erbracht werden kann: ",
  maxSeminarsCP: "Die maximale Anzahl an CP, die für Seminare in diesem Bereich erbracht werden kann: ",
  maxSeminarsCount: "Diese Anzahl an Seminaren kann maximal in diesem Bereich erbracht werden: ",
  minPraktikumCount: "Diese Anzahl an Praktika kann minimal in diesem Bereich erbracht werden: ",
  maxPraktikumCount: "Diese Anzahl an Praktika kann maximal in diesem Bereich erbracht werden: ",
  minVorlesungCount: "Diese Anzahl an Vorlesungen kann minimal in diesem Bereich erbracht werden: ",
  maxVorlesungCount: "Diese Anzahl an Vorlesungen kann maximal in diesem Bereich erbracht werden: ",
  minModuleCount: "Diese Anzahl an Modulen müssen in diesem Bereich erbracht werden: "
}
type DescriptionsKey = keyof typeof descriptions;
type Modul =  {
  moduleID: string,
  moduleName: string,
  moduleCredits: string,
  moduleLanguage: string,
  moduleApplicability: string
}
type ModulWrapper = {
  name: Modul,
  moduleID: string,
  creditPoints: number,
  pflicht: boolean,
  nichtwählbarmitmodul: Array<object>
}
 

export default function ExamPlanForm() {
  const [examRegulation, setExamRegulation] = React.useState<{
    jsonSchema: string;
    name: string;
  }>({
    jsonSchema: "",
    name: ""
  });
  const [typeOfExamPlan, setTypeOfExamPlan] = React.useState<
    string | null
  >(null);
  const [displayExamPlan, setDisplayExamPlan] = React.useState(false); 
  const [examPlan, setExamPlan] = React.useState<object>({});
  const examRegulationNames = [
    'B.Sc. Mathematik 2018',
    'M.Sc. Mathematik 2015',
  ];


/**
 * 
 * @param param0 
 * @returns ui for the exam plsn
 */
function Item( {entry, nestedKeys}:{entry: Array<string | unknown>, nestedKeys: string} ) {
  const [index, setIndex] = React.useState<number | null>(0);
  const key =  entry[0] as string
  const value = entry[1]
  if (nestedKeys){
    nestedKeys = nestedKeys + "."
  }
  if (key === "area") {
    return <Box sx={{ p: 2, border: 1, borderRadius: 2 , mt:2 }}> 
     {Object.entries(value as object).map((newEntry) => (
     <Item entry = {newEntry} nestedKeys={nestedKeys+key}/>))}
     </Box>
  }
  else if (key === "subarea"){
    return <Box sx={{ p: 2, border: 1, borderRadius: 2 , mt:2 }}>
     {(value as Array<object>).map((e:object, index:number) => {return <div>{Object.entries(e).map((newEntry) => (
     <Item entry = {newEntry} nestedKeys={nestedKeys+key+"."+index}/>))}</div>}) }
     </Box>
  }
  else if (Object.keys(descriptions).includes(key)){
    return <Typography textAlign="left" level="body-md">{descriptions[key as DescriptionsKey]}{value as string}</Typography>
  }
  else if (key === "name") {
    return <Typography textAlign="left" level = "h3" sx= {{mb:2}}>{value as string}</Typography>
  }
  else if (key === "module") {
    nestedKeys = nestedKeys+"module"
    return (
         <Accordion
           expanded={index === 0}
           onChange={(_event, expanded) => {
             setIndex(expanded ? 0 : null);
           }}
         >
           <AccordionSummary></AccordionSummary>
           <AccordionDetails>
            <Select
              multiple
              defaultValue={[]}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', gap: '0.25rem' }}>
                  {selected.map((selectedOption) => (
                    <Chip variant="soft" color="primary">
                      {selectedOption.label}
                    </Chip>
                  ))}
                </Box>
              )}
              sx={{
                minWidth: '15rem',
              }}
              slotProps={{
                listbox: {
                  sx: {
                    width: '100%',
                  },
                },
              }}
              onChange={(
                _event: React.SyntheticEvent | null,
                newValue: string[][]
              )  => {
                console.log(nestedKeys)
                setExamPlan(produce(examPlan, (draft) => {if (draft) {objectPath.set(draft, nestedKeys, newValue)}}))
              }}
            >
              {(value as Array<ModulWrapper>).map((e:ModulWrapper) => {return <Option value = {e.name}>{e.name.moduleID}</Option>})}
            </Select>
           </AccordionDetails>
         </Accordion>
     );
   }
   else  {return <div>Error loading component</div>}
 }
 
  const onRegulationChange = (name: string | null) => {
    if (name == null) throw Error();
    //todo: retrieve examRegulation from database
    setExamRegulation({
      jsonSchema: JSON.stringify({
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
                                moduleName:
                                  'Introduction to Mathematical Logic',
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
                                moduleName:
                                  'Einführung in die Finanzmathematik',
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
                            moduleName:
                              'English Paternoster for Mathematicians',
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
      }),
      name: 'B.Sc. Mathematik/Mathematik (2018)'
    });
    const x = {
      area: {
        name: 'B.Sc. Mathematik/Mathematik 2018',
        minCreditPointsOverall: 180,
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
              }]
            }
        ]
      }
    }
    setExamRegulation({
      jsonSchema: JSON.stringify(x),
      name: 'B'
    })
    setExamPlan(x)
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
        {displayExamPlan && Object.entries(JSON.parse(examRegulation?.jsonSchema)).map((entry) => (
          <Item entry = {entry}  nestedKeys={""} />
        ))}
        {JSON.stringify(examPlan)}
      </div>
    </>
  );
}
