import * as React from 'react';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { Select, Option, FormControl, FormLabel, Radio, RadioGroup, Sheet, Typography, Textarea} from '@mui/joy';
import { Button, Box, } from '@mui/material';
import {PlanForm} from './examPlan';
import { setExamPlan, getExamPlan } from './examPlanVariable';
import objectPath from 'object-path';
import {AxiosError} from 'axios';
import {getExamRegulations} from '../../../intern/src/database_services/ExamRegulationService.ts'

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
  const [hasExamPlan, setHasExamPlan] = React.useState(false);

  let examRegulationNames = new Array<string>;
  React.useEffect(() => {
    getExamRegulations()
  .then((responseData: { jsonSchema: object, name:string}[]) => { 
    console.log("Success at getting exam Regulations");
    examRegulationNames = responseData.map((entry) => entry.name)
    console.log(examRegulationNames)
  })
  .catch((e: AxiosError) => { console.log(e) })
  }, []);
    
  
  
  
  /* examRegulationNames = [
    'B.Sc. Mathematik/ Mathematik 2018',
    'B.Sc. Mathematik/Wirtschaftsmathematik (2018)',
    'M.Sc. Mathematik/Wirtschaftsmathematik (2018)',
    'M.Sc. Mathematik/Mathematik (2018)',
    'M.Sc. Mathematik Interdisziplinär (2018)',
    'M.Sc. Mathematics (2018)',
    'Lehramt an Gymnasien (2017)',
    'Lehramt an Gymnasien (2023)'
  ]; */

  
  const onRegulationChange = (name: string | null) => {
    if (name == null) throw Error();
    //todo: retrieve examRegulation from database
    let x = new Object;
    if (name === "B.Sc. Mathematik/ Mathematik 2018"){
      x = {
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
    }
    else if (name === 'M.Sc. Mathematics (2018)') {
      x = {"area":{"name":"Advanced Courses in Mathematics","minCreditPointsOverall":36,"description":"From two different fields of research on specialisation module each must be chosen (18 CPs each). The contents of the respective specialisation module will be agreed between students and examiners individually. In general, the contents of the respective area of specialisation consist of the module contents totalling 18-20 CPs which are distributed as follows: 2x9 or 1x9+2x5 or 4x5."}}
    }
    else if (name === 'B.Sc. Mathematik/Wirtschaftsmathematik (2018)'){
      x = {"area":{"name":"B.Sc. Mathematik/Wirtschaftsmathematik (2018)","minCreditPointsOverall":180,"subarea":[{"name":"Pflichtbereich Mathematik","minCreditPointsOverall":91},{"name":"Seminar/Projekt","minCreditPointsOverall":5,"description":"Im Seminar oder Projekt muss ein Thema aus der Optimierung oder Stochastik behandelt werden"},{"name":"Wahlbereich","minCreditPointsOverall":72,"subarea":[{"name":"Fachlicher Bereich","minCreditPointsOverall":52,"maxCreditPointsOverall":55},{"name":"Wahlpflichtbereich Mathematik","description":"Es müssen im Umfang von mindestens 5 CP Module aus Optimierung oder Stochastik belegt werden.\nWeitere Module nach Genehmigung.","minCreditPointsOverall":9,"maxCreditPointsOverall":15,"module":[{"name":{"moduleID":"04-10-0018/de","moduleName":"Einführung in die Algebra","moduleCredits":5,"moduleLanguage":"Deutsch","moduleApplicability":"B.Sc. Mathematik, LaG Mathematik"},"moduleID":"04-10-0018/de","creditPoints":5,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-10-0226/en","moduleName":"Complex Analysis","moduleCredits":5,"moduleLanguage":"Englisch","moduleApplicability":"B.Sc. Mathematik, LaG Mathematik"},"moduleID":"04-10-0226/en","creditPoints":5,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-00-0036","moduleName":"Funktionalanalysis","moduleCredits":9,"moduleLanguage":"Deutsch","moduleApplicability":"Für B.Sc.Math, B.Sc.MCS, B.Sc.WiMa, B.Sc.ME: math. Wahlbereich Für M.Sc.Math, M.Sc.WiMa: Ergänzungsbereich wird in einigen Vertiefungen partielle Differentialgleichungen und in Algebra/ Geometrie/Funktionalanalysis vorausgesetzt."},"moduleID":"04-00-0036","creditPoints":9,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-10-0393/de","moduleName":"Numerik Gewöhnlicher Differentialgleichungen","moduleCredits":9,"moduleLanguage":"Deutsch","moduleApplicability":"B.Sc. Mathematik, M.Sc Mathematik, M.Sc. Mathematics (nicht zusammen mit 04-10- 0042/de belegbar)"},"moduleID":"04-10-0393/de","creditPoints":9,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-10-0043/de","moduleName":"Numerische Lineare Algebra","moduleCredits":5,"moduleLanguage":"Deutsch","moduleApplicability":"B.Sc. Mathematik, M.Sc Mathematik, M.Sc. Mathematics M.Sc. ETIT"},"moduleID":"04-10-0043/de","creditPoints":5,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-00-0034","moduleName":"Diskrete Mathematik","moduleCredits":9,"moduleLanguage":"Deutsch","moduleApplicability":""},"moduleID":"04-00-0034","creditPoints":9,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-10-0203","moduleName":"Innere Punkte Verfahren der konvexen Optimierung","moduleCredits":5,"moduleLanguage":"Deutsch und Englisch","moduleApplicability":"B.Sc Mathematik, M.Sc. Mathematik, M.Sc. Mathematics"},"moduleID":"04-10-0203","creditPoints":5,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-10-0202","moduleName":"Nichtglatte Optimierung","moduleCredits":5,"moduleLanguage":"Deutsch und Englisch","moduleApplicability":"M.Sc. Mathematik, M.Sc. Mathematics"},"moduleID":"04-10-0202","creditPoints":5,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-00-0281","moduleName":"Spieltheorie","moduleCredits":6,"moduleLanguage":"Deutsch","moduleApplicability":"B.Sc.Math:Wahlpflichtbereich, Ergänzungsbereich"},"moduleID":"04-00-0312","creditPoints":5,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-10-0047/de","moduleName":"Einführung in die Finanzmathematik","moduleCredits":5,"moduleLanguage":"Deutsch","moduleApplicability":"B.Sc. Mathematik, M.Sc Mathematik, M.Sc. Mathematics"},"moduleID":"04-10-0047/de","creditPoints":5,"pflicht":false,"nichtwählbarmitmodul":[]}]},{"name":"Nebenfach Wirtschaftswissenschaften","description":"Leitstudiengänge B.Sc. WInf, B.Sc. WI MB","minCreditPointsOverall":25,"maxCreditPointsOverall":31},{"name":"Nebenfach Informatik","description":"Leitstudiengang B.Sc. Informatik","minCreditPointsOverall":15,"maxCreditPointsOverall":21,"module":[{"name":{"moduleID":"20-00-0004","moduleName":"Funktionale und objektorientierte Programmierkonzepte","moduleCredits":10,"moduleLanguage":"deutsch","moduleApplicability":"B.Sc. Mathematik"},"moduleID":"20-00-0004","creditPoints":10,"pflicht":true,"nichtwählbarmitmodul":[]}]},{"name":"Überfachlicher Bereich","subarea":[{"name":"Überfachlicher Pflichtbereich","minCreditPointsOverall":9},{"name":"Überfachlicher Wahlbereich","minCreditPointsOverall":5,"maxCreditPointsOverall":8,"subarea":[{"name":"Mathematische Allgemeinbildung oder Praktikum","description":"Ein Modul muss belegt werden. Weitere Module nach Genehmigung.","minCreditPointsOverall":5,"maxCreditPointsOverall":8,"module":[{"name":{"moduleID":"04-10-0044/de","moduleName":"Einführung in die Mathematische Modellierung","moduleCredits":5,"moduleLanguage":"Deutsch","moduleApplicability":"B.Sc. Mathematik, LaG Mathematik"},"moduleID":"04-10-0044/de","creditPoints":5,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-10-0023/de","moduleName":"Mathematik im Kontext","moduleCredits":3,"moduleLanguage":"Deutsch","moduleApplicability":"B.Sc. Mathematik, Wahlpflichtbereich Ü"},"moduleID":"04-10-0023/de","creditPoints":3,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-10-0021/de","moduleName":"Logik und Grundlagen","moduleCredits":3,"moduleLanguage":"Deutsch","moduleApplicability":"B.Sc. Mathematik, Wahlpflichtbereich Ü"},"moduleID":"04-10-0021/de","creditPoints":3,"pflicht":false,"nichtwählbarmitmodul":[]}]},{"name":"Mathematisches Handwerkszeug","minCreditPointsOverall":0,"maxCreditPointsOverall":3,"module":[{"name":{"moduleID":"41-21-0922","moduleName":"English Paternoster for Mathematicians","moduleCredits":3,"moduleLanguage":"english","moduleApplicability":"B.Sc. Mathematik, M.Sc. Mathematik"},"moduleID":"41-21-0922","creditPoints":3,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"41-21-0382","moduleName":"English for Mathematicians","moduleCredits":3,"moduleLanguage":"english","moduleApplicability":"B.Sc. Mathematik"},"moduleID":"41-21-0382","creditPoints":3,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-10-0398/de","moduleName":"Interdisziplinäres Projekt","moduleCredits":2,"moduleLanguage":"Deutsch","moduleApplicability":"B.Sc. Mathematik"},"moduleID":"04-10-0398/de","creditPoints":2,"pflicht":false,"nichtwählbarmitmodul":[]}],"description":"Weitere Module nach Genehmigung."}]},{"name":"Studium Generale","description":"Gesamtkatalog aller Moduel der TU Darmstadt. Ausgenommen sind Veranstaltungen des Fachbereichs Mathematik und der Nebenfächer, sofern sie nicht ausschließlich als Studium Generale wählbar sind. Module mathematischen Inhalts, welcher in vergleichbarer Form auch in Modulen des Fachbereichs Mathematik abgedeckt wird, sind ebenfalls ausgeschlossen.","minCreditPointsOverall":3,"maxCreditPointsOverall":6}],"minCreditPointsOverall":17,"maxCreditPointsOverall":20}]},{"name":"Abschlussarbeit","minCreditPointsOverall":12}]}}
    }
    else if (name === 'M.Sc. Mathematik/Wirtschaftsmathematik (2018)'){
      x = {"area":{"name":"M.Sc. Mathematik/Wirtschaftsmathematik (2018)","minCreditPointsOverall":120,"subarea":[{"name":"Mathematische Vertiefungen","minCreditPointsOverall":18,"description":"Zu wählen ist ein Vertiefungsmodul. Alle Vertiefungsmodule werden auch als englische Variante (04-13-xxxx/en) angeboten.\nDie Inhalte des Vertiefungsmoduls werden individuell zwischen Studierenden und Prüfenden vereinbart. In der Regel setzen sich die Inhalte aus den Lerninhalten von Modulen im Gesamtumfang von 18-20 CP (2x9 oder 1x9+2x5 oder 4x5) der jeweiligen Vertiefungsrichtung zusammen.","module":[{"name":{"moduleID":"04-13-0013/de","moduleName":"Vertiefungsmodul Optimierung","moduleCredits":18,"moduleLanguage":"Deutsch","moduleApplicability":"Vertiefungsmodul"},"moduleID":"04-13-0013/de","creditPoints":18,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-13-0015/de","moduleName":"Vertiefungsmodul Stochastik","moduleCredits":18,"moduleLanguage":"Deutsch","moduleApplicability":"Vertiefungsbereich Master Mathematik"},"moduleID":"04-13-0015/de","creditPoints":18,"pflicht":false,"nichtwählbarmitmodul":[]}],"maxCreditPointsOverall":20,"minSubAreaCheck":1,"maxSubAreaCheck":1},{"name":"Mathematisches Seminar/Projekt","minCreditPointsOverall":5,"description":"Es ist ein Semianr oder Projekt (5 CP) aus den Forschungsgebieten Optimierung oder Stochastik zu belegen."},{"name":"Wahlbereich","minCreditPointsOverall":62,"subarea":[{"name":"Fachlicher Bereich","minCreditPointsOverall":54,"maxCreditPointsOverall":59},{"name":"Mathematischer Ergänzungsbereich","description":"Zu wählen sind Module im Gesamtumfang von 18-30 CP. Davon stammen mindestens 9 CP aus dem Forschungsgebiet Optimierung, falls das Vertiefungsmodul Stochastik ist, bzw. umgekehrt.\nWeitere Module nach Genehmigung.","minCreditPointsOverall":18,"maxCreditPointsOverall":30,"module":[{"name":{"moduleID":"04-10-0018/de","moduleName":"Einführung in die Algebra","moduleCredits":5,"moduleLanguage":"Deutsch","moduleApplicability":"B.Sc. Mathematik, LaG Mathematik"},"moduleID":"04-10-0018/de","creditPoints":5,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-10-0226/en","moduleName":"Complex Analysis","moduleCredits":5,"moduleLanguage":"Englisch","moduleApplicability":"B.Sc. Mathematik, LaG Mathematik"},"moduleID":"04-10-0226/en","creditPoints":5,"pflicht":false,"nichtwählbarmitmodul":[]}],"subarea":[{"name":"Module mit Empfehlung \"Mathematik: Master\" laut Modulhandbuch","description":"Siehe Kataloge unter M.Sc. Mathematik: 4./5. Studienjahr","minCreditPointsOverall":0,"maxCreditPointsOverall":30},{"name":"Module aus dem Wahlpflichtbereich Mathematik des B.Sc. Mathematik","description":"Module aus dem Wahlpflichtbereich Mathematik des B.Sc. Mathematik (Studienrichtung Mathematik) mit Empfehlung \"Mathematik: Bachelor 3. Jahr\" laut Modulhandbuch: Siehe Kataloge unter B.Sc. Mathematik: 3. Studienjahr","minCreditPointsOverall":0,"maxCreditPointsOverall":30}]},{"name":"Nicht-mathematischer Vertiefungsbereich: Wirtschaftswissenschaften","description":"Es sind Module im Gesamtumfang von 22-34 Leistungspunkten zu wählen. Dabei muss ein Seminar\nim Umfang von 5 CP in den Wirtschaftswissenschaften belegt werden.\nLeitstudiengänge: B.Sc. WInf, B.Sc. WI MB, M.Sc. WI MB","minCreditPointsOverall":22,"maxCreditPointsOverall":34},{"name":"Nebenfach Wirtschaftsinformatik","description":"Leitstudiengänge B.Sc. WInf, B.Sc. Informatik","minCreditPointsOverall":7,"maxCreditPointsOverall":19},{"name":"Überfachlicher Bereich","subarea":[{"name":"Überfachlicher Wahlbereich","minCreditPointsOverall":0,"maxCreditPointsOverall":5,"module":[{"name":{"moduleID":"04-10-0051/de","moduleName":"Externes Praktikum","moduleCredits":5,"moduleLanguage":"Deutsch","moduleApplicability":"B.Sc. Mathematik (nur PO 2011!), M.Sc. Mathematik, M.Sc. Mathematics nur PO 2011 und PO 2018)"},"moduleID":"04-10-0051/de","creditPoints":5,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-10-0077","moduleName":"Halten einer Übungsgruppe","moduleCredits":3,"moduleLanguage":"Deutsch und Englisch","moduleApplicability":"M.Sc. Mathematik, M.Sc. Mathematics"},"moduleID":"04-10-0077","creditPoints":3,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"41-21-0922","moduleName":"English Paternoster for Mathematicians","moduleCredits":3,"moduleLanguage":"english","moduleApplicability":"B.Sc. Mathematik, M.Sc. Mathematik"},"moduleID":"41-21-0922","creditPoints":3,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"41-21-0382","moduleName":"English for Mathematicians","moduleCredits":3,"moduleLanguage":"english","moduleApplicability":"B.Sc. Mathematik"},"moduleID":"41-21-0382","creditPoints":3,"pflicht":false,"nichtwählbarmitmodul":[]}],"subarea":[{"name":"Wirtschaftswissenschaften um fehlendes Vorwissen zu ergänzen","minCreditPointsOverall":0,"maxCreditPointsOverall":5},{"name":"Informatik um fehlendes Vorwissen zu ergänzen","minCreditPointsOverall":0,"maxCreditPointsOverall":5}]},{"name":"Studium Generale","minCreditPointsOverall":3,"maxCreditPointsOverall":8,"description":"Gesamtkatalog aller Moduel der TU Darmstadt. Ausgenommen sind Veranstaltungen des Fachbereichs Mathematik und der Nebenfächer, sofern sie nicht ausschließlich als Studium Generale wählbar sind. Module mathematischen Inhalts, welcher in vergleichbarer Form auch in Modulen des Fachbereichs Mathematik abgedeckt wird, sind ebenfalls ausgeschlossen."}],"minCreditPointsOverall":3,"maxCreditPointsOverall":8}]},{"name":"Abschlussarbeit","minCreditPointsOverall":35,"module":[{"name":{"moduleID":"04-10-0229","moduleName":"Einführung in das wissenschaftliche Arbeiten","moduleCredits":5,"moduleLanguage":"Deutsch und Englisch","moduleApplicability":"M.Sc. Mathematik, M.Sc. Mathematics"},"moduleID":"04-10-0229","creditPoints":5,"pflicht":true,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-00-5000/de","moduleName":"Masterarbeit","moduleCredits":30,"moduleLanguage":"Deutsch","moduleApplicability":"M.Sc. Mathematik"},"moduleID":"04-00-5000/de","creditPoints":30,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-00-5000/en","moduleName":"Master thesis","moduleCredits":30,"moduleLanguage":"English","moduleApplicability":"M.Sc. Mathematik, M.Sc. Mathematics"},"moduleID":"04-00-5000/en","creditPoints":30,"pflicht":false,"nichtwählbarmitmodul":[]}]}]}}
    }
    else if (name === 'M.Sc. Mathematik/Mathematik (2018)'){
      x = {"area":{"name":"M.Sc. Mathematik/Mathematik (2018)","minCreditPointsOverall":120,"subarea":[{"name":"Mathematische Vertiefungen","minCreditPointsOverall":36,"description":"Aus zwei verschiedenen Forschungsgebieten ist jeweils ein Vertiefungsmodul zu wählen (je 18 CP). Alle Vertiefungsmodule werden auch als englische Variante (04-13-xxxx/en) angeboten.\nDie Inhalte des jeweiligen Vertiefungsmoduls werden individuell zwischen Studierenden und Prüfenden vereinbart. In der Regel setzen sich die Inhalte aus den Lerninhalten von Modulen im Gesamtumfang von 18-20 CP (2x9 oder 1x9+2x5 oder 4x5) der jeweiligen Vertiefungsrichtung zusammen.","module":[{"name":{"moduleID":"04-13-0003/de","moduleName":"Vertiefungsmodul Algebra","moduleCredits":18,"moduleLanguage":"Deutsch","moduleApplicability":"Vertiefungsbereich Master Mathematik"},"moduleID":"04-13-0003/de","creditPoints":18,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-13-0011/de","moduleName":"Vertiefungsmodul Analysis","moduleCredits":18,"moduleLanguage":"Deutsch","moduleApplicability":"Vertiefungsbereich Master Mathematik"},"moduleID":"04-13-0011/de","creditPoints":18,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-13-0005/de","moduleName":"Vertiefungsmodul Geometrie und Approximation","moduleCredits":18,"moduleLanguage":"Deutsch","moduleApplicability":""},"moduleID":"04-13-0005/de","creditPoints":18,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-13-0007/de","moduleName":"Vertiefungsmodul Logik","moduleCredits":18,"moduleLanguage":"Deutsch","moduleApplicability":"Vertiefungsbereich Master Mathematik"},"moduleID":"04-13-0007/de","creditPoints":18,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-13-0009/de","moduleName":"Vertiefungsmodul Numerik und wissenschaftliches Rechnen","moduleCredits":18,"moduleLanguage":"Deutsch","moduleApplicability":"Vertiefungsbereich Master Mathematik"},"moduleID":"04-13-0009/de","creditPoints":18,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-13-0013/de","moduleName":"Vertiefungsmodul Optimierung","moduleCredits":18,"moduleLanguage":"Deutsch","moduleApplicability":"Vertiefungsmodul"},"moduleID":"04-13-0013/de","creditPoints":18,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-13-0015/de","moduleName":"Vertiefungsmodul Stochastik","moduleCredits":18,"moduleLanguage":"Deutsch","moduleApplicability":"Vertiefungsbereich Master Mathematik"},"moduleID":"04-13-0015/de","creditPoints":18,"pflicht":false,"nichtwählbarmitmodul":[]}],"maxCreditPointsOverall":40,"minSubAreaCheck":2,"maxSubAreaCheck":2},{"name":"Mathematisches Seminar/Projekt","minCreditPointsOverall":10,"description":"Es sind zwei Seminare oder ein Seminar und ein Projekt (10 CP) aus unterschiedlichen Forschungsgebieten zu belegen."},{"name":"Wahlbereich","minCreditPointsOverall":39,"subarea":[{"name":"Fachlicher Bereich","minCreditPointsOverall":31,"maxCreditPointsOverall":36},{"name":"Mathematischer Ergänzungsbereich","minCreditPointsOverall":14,"maxCreditPointsOverall":27,"subarea":[{"name":"Module mit Empfehlung \"Mathematik: Master\" laut Modulhandbuch","description":"Siehe Kataloge unter M.Sc. Mathematik: 4./5. Studienjahr","minCreditPointsOverall":0,"maxCreditPointsOverall":27},{"name":"Module aus dem Wahlpflichtbereich Mathematik des B.Sc. Mathematik","description":"Module aus dem Wahlpflichtbereich Mathematik des B.Sc. Mathematik (Studienrichtung Mathematik) mit Empfehlung \"Mathematik: Bachelor 3. Jahr\" laut Modulhandbuch: Siehe Kataloge unter B.Sc. Mathematik: 3. Studienjahr","minCreditPointsOverall":0,"maxCreditPointsOverall":27}]},{"name":"Nebenfach","description":"Es ist ein Nebenfach zu wählen. Informationen zu den Nebenfächern unter www.mathematik.tu-darmstadt.de/nebenfach.","minCreditPointsOverall":9,"maxCreditPointsOverall":22},{"name":"Überfachlicher Bereich","minCreditPointsOverall":3,"maxCreditPointsOverall":8,"subarea":[{"name":"Überfachlicher Wahlbereich","minCreditPointsOverall":0,"maxCreditPointsOverall":5,"module":[{"name":{"moduleID":"04-10-0051/de","moduleName":"Externes Praktikum","moduleCredits":5,"moduleLanguage":"Deutsch","moduleApplicability":"B.Sc. Mathematik (nur PO 2011!), M.Sc. Mathematik, M.Sc. Mathematics nur PO 2011 und PO 2018)"},"moduleID":"04-10-0051/de","creditPoints":5,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-10-0077","moduleName":"Halten einer Übungsgruppe","moduleCredits":3,"moduleLanguage":"Deutsch und Englisch","moduleApplicability":"M.Sc. Mathematik, M.Sc. Mathematics"},"moduleID":"04-10-0077","creditPoints":3,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"41-21-0922","moduleName":"English Paternoster for Mathematicians","moduleCredits":3,"moduleLanguage":"english","moduleApplicability":"B.Sc. Mathematik, M.Sc. Mathematik"},"moduleID":"41-21-0922","creditPoints":3,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"41-21-0382","moduleName":"English for Mathematicians","moduleCredits":3,"moduleLanguage":"english","moduleApplicability":"B.Sc. Mathematik"},"moduleID":"41-21-0382","creditPoints":3,"pflicht":false,"nichtwählbarmitmodul":[]}],"subarea":[{"name":"Module aus dem Nebenfach","minCreditPointsOverall":0,"maxCreditPointsOverall":5,"description":"Wurde das Nebenfach zum Master gewechselt, dürfen Module aus dem Pflichtbereich des entsprechenden Bachelor-Nebenfachs belegt werden, um fehlende Vorkenntnisse auszugleichen."}]},{"name":"Studium Generale","minCreditPointsOverall":3,"maxCreditPointsOverall":8,"description":"Gesamtkatalog aller Moduel der TU Darmstadt. Ausgenommen sind Veranstaltungen des Fachbereichs Mathematik und der Nebenfächer, sofern sie nicht ausschließlich als Studium Generale wählbar sind. Module mathematischen Inhalts, welcher in vergleichbarer Form auch in Modulen des Fachbereichs Mathematik abgedeckt wird, sind ebenfalls ausgeschlossen."}]}]},{"name":"Abschlussarbeit","minCreditPointsOverall":35,"module":[{"name":{"moduleID":"04-10-0229","moduleName":"Einführung in das wissenschaftliche Arbeiten","moduleCredits":5,"moduleLanguage":"Deutsch und Englisch","moduleApplicability":"M.Sc. Mathematik, M.Sc. Mathematics"},"moduleID":"04-10-0229","creditPoints":5,"pflicht":true,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-00-5000/de","moduleName":"Masterarbeit","moduleCredits":30,"moduleLanguage":"Deutsch","moduleApplicability":"M.Sc. Mathematik"},"moduleID":"04-00-5000/de","creditPoints":30,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-00-5000/en","moduleName":"Master thesis","moduleCredits":30,"moduleLanguage":"English","moduleApplicability":"M.Sc. Mathematik, M.Sc. Mathematics"},"moduleID":"04-00-5000/en","creditPoints":30,"pflicht":false,"nichtwählbarmitmodul":[]}]}]}}
    }
    else if (name === 'M.Sc. Mathematik Interdisziplinär (2018)'){
      x = {"area":{"name":"M.Sc. Mathematik interdisziplinär","minCreditPointsOverall":120,"description":"","subarea":[{"name":"Mathematische Vertiefungen","minCreditPointsOverall":18,"description":"Zu wählen ist ein Vertiefungsmodul. Alle Vertiefungsmodule werden auch als englische Variante (04-13-xxxx/en) angeboten.\nDie Inhalte des Vertiefungsmoduls werden individuell zwischen Studierenden und Prüfenden vereinbart. In der Regel setzen sich die Inhalte aus den Lerninhalten von Modulen im Gesamtumfang von 18-20 CP (2x9 oder 1x9+2x5 oder 4x5) der jeweiligen Vertiefungsrichtung zusammen.","module":[{"name":{"moduleID":"04-13-0003/de","moduleName":"Vertiefungsmodul Algebra","moduleCredits":18,"moduleLanguage":"Deutsch","moduleApplicability":"Vertiefungsbereich Master Mathematik"},"moduleID":"04-13-0003/de","creditPoints":18,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-13-0011/de","moduleName":"Vertiefungsmodul Analysis","moduleCredits":18,"moduleLanguage":"Deutsch","moduleApplicability":"Vertiefungsbereich Master Mathematik"},"moduleID":"04-13-0011/de","creditPoints":18,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-13-0005/de","moduleName":"Vertiefungsmodul Geometrie und Approximation","moduleCredits":18,"moduleLanguage":"Deutsch","moduleApplicability":""},"moduleID":"04-13-0005/de","creditPoints":18,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-13-0007/de","moduleName":"Vertiefungsmodul Logik","moduleCredits":18,"moduleLanguage":"Deutsch","moduleApplicability":"Vertiefungsbereich Master Mathematik"},"moduleID":"04-13-0007/de","creditPoints":18,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-13-0009/de","moduleName":"Vertiefungsmodul Numerik und wissenschaftliches Rechnen","moduleCredits":18,"moduleLanguage":"Deutsch","moduleApplicability":"Vertiefungsbereich Master Mathematik"},"moduleID":"04-13-0009/de","creditPoints":18,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-13-0013/de","moduleName":"Vertiefungsmodul Optimierung","moduleCredits":18,"moduleLanguage":"Deutsch","moduleApplicability":"Vertiefungsmodul"},"moduleID":"04-13-0013/de","creditPoints":18,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-13-0015/de","moduleName":"Vertiefungsmodul Stochastik","moduleCredits":18,"moduleLanguage":"Deutsch","moduleApplicability":"Vertiefungsbereich Master Mathematik"},"moduleID":"04-13-0015/de","creditPoints":18,"pflicht":false,"nichtwählbarmitmodul":[]}],"maxCreditPointsOverall":20,"minSubAreaCheck":1,"maxSubAreaCheck":1},{"name":"Mathematisches Seminar/Projekt","minCreditPointsOverall":5,"description":"Es ist ein Seminar oder ein Projekt (10 CP) zu belegen."},{"name":"Wahlbereich","minCreditPointsOverall":62,"subarea":[{"name":"Fachlicher Bereich","minCreditPointsOverall":54,"maxCreditPointsOverall":59},{"name":"Mathematischer Ergänzungsbereich","minCreditPointsOverall":18,"maxCreditPointsOverall":30,"subarea":[{"name":"Module mit Empfehlung \"Mathematik: Master\" laut Modulhandbuch","description":"Siehe Kataloge unter M.Sc. Mathematik: 4./5. Studienjahr","minCreditPointsOverall":0,"maxCreditPointsOverall":30},{"name":"Module aus dem Wahlpflichtbereich Mathematik des B.Sc. Mathematik","description":"Module aus dem Wahlpflichtbereich Mathematik des B.Sc. Mathematik (Studienrichtung Mathematik) mit Empfehlung \"Mathematik: Bachelor 3. Jahr\" laut Modulhandbuch: Siehe Kataloge unter B.Sc. Mathematik: 3. Studienjahr","minCreditPointsOverall":0,"maxCreditPointsOverall":30}]},{"name":"Nicht-mathematischer Vertiefungsbereich","minCreditPointsOverall":22,"maxCreditPointsOverall":34,"description":"Es ist ein Fach zu wählen. Informationen zu den nicht-mathematischen Vertiefungen unter www.mathematik.tu-darmstadt.de/... .\nEs muss ein Anwendungsbezug zur Mathematik gegeben sein."},{"name":"Nebenfach","minCreditPointsOverall":7,"maxCreditPointsOverall":19,"description":"Es ist ein Nebenfach zu wählen. Informationen zu den Nebenfächern unter www.mathematik.tu-darmstadt.de/nebenfach."},{"name":"Überfachlicher Bereich","subarea":[{"name":"Überfachlicher Wahlbereich","minCreditPointsOverall":0,"maxCreditPointsOverall":5,"module":[{"name":{"moduleID":"04-10-0051/de","moduleName":"Externes Praktikum","moduleCredits":5,"moduleLanguage":"Deutsch","moduleApplicability":"B.Sc. Mathematik (nur PO 2011!), M.Sc. Mathematik, M.Sc. Mathematics nur PO 2011 und PO 2018)"},"moduleID":"04-10-0051/de","creditPoints":5,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-10-0077","moduleName":"Halten einer Übungsgruppe","moduleCredits":3,"moduleLanguage":"Deutsch und Englisch","moduleApplicability":"M.Sc. Mathematik, M.Sc. Mathematics"},"moduleID":"04-10-0077","creditPoints":3,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"41-21-0922","moduleName":"English Paternoster for Mathematicians","moduleCredits":3,"moduleLanguage":"english","moduleApplicability":"B.Sc. Mathematik, M.Sc. Mathematik"},"moduleID":"41-21-0922","creditPoints":3,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"41-21-0382","moduleName":"English for Mathematicians","moduleCredits":3,"moduleLanguage":"english","moduleApplicability":"B.Sc. Mathematik"},"moduleID":"41-21-0382","creditPoints":3,"pflicht":false,"nichtwählbarmitmodul":[]}],"subarea":[{"name":"Module aus dem Nebenfach","minCreditPointsOverall":0,"maxCreditPointsOverall":5,"description":"Wurde das Nebenfach zum Master gewechselt, dürfen Module aus dem Pflichtbereich des entsprechenden Bachelor-Nebenfachs belegt werden, um fehlende Vorkenntnisse auszugleichen."},{"name":"Module aus der gewählten nicht-mathematischen Vertiefung","minCreditPointsOverall":0,"maxCreditPointsOverall":5,"description":"Module aus gewähltem nicht-mathematischen Vertiefungsbereich (um fehlendes Vorwissen zu ergänzen)."}]},{"name":"Studium Generale","minCreditPointsOverall":3,"maxCreditPointsOverall":8,"description":"Gesamtkatalog aller Moduel der TU Darmstadt. Ausgenommen sind Veranstaltungen des Fachbereichs Mathematik und der Nebenfächer, sofern sie nicht ausschließlich als Studium Generale wählbar sind. Module mathematischen Inhalts, welcher in vergleichbarer Form auch in Modulen des Fachbereichs Mathematik abgedeckt wird, sind ebenfalls ausgeschlossen."}],"minCreditPointsOverall":3,"maxCreditPointsOverall":8}]},{"name":"Abschlussarbeit","minCreditPointsOverall":35,"module":[{"name":{"moduleID":"04-10-0229","moduleName":"Einführung in das wissenschaftliche Arbeiten","moduleCredits":5,"moduleLanguage":"Deutsch und Englisch","moduleApplicability":"M.Sc. Mathematik, M.Sc. Mathematics"},"moduleID":"04-10-0229","creditPoints":5,"pflicht":true,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-00-5000/de","moduleName":"Masterarbeit","moduleCredits":30,"moduleLanguage":"Deutsch","moduleApplicability":"M.Sc. Mathematik"},"moduleID":"04-00-5000/de","creditPoints":30,"pflicht":false,"nichtwählbarmitmodul":[]},{"name":{"moduleID":"04-00-5000/en","moduleName":"Master thesis","moduleCredits":30,"moduleLanguage":"English","moduleApplicability":"M.Sc. Mathematik, M.Sc. Mathematics"},"moduleID":"04-00-5000/en","creditPoints":30,"pflicht":false,"nichtwählbarmitmodul":[]}]}]}}
    }
    else if (name === 'Lehramt an Gymnasien (2017)'){
      x = {"area":{"name":"Pflichtbereich Mathematik","minCreditPointsOverall":83}}
    }
    else if (name === 'Lehramt an Gymnasien (2023)'){
      x = {"area":{"name":"Pflichtbereich Mathematik","minCreditPointsOverall":83}}
    }
    setExamRegulation({
      jsonSchema: JSON.stringify(x),
      name: name
    });
    setExamPlan(x)
    setHasExamPlan(true)
  };

  return (
    <>
      <h1>Antrag Detailansicht</h1>
      {(!hasExamPlan || typeOfExamPlan===null) &&
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
      </Box>}
      {(hasExamPlan && typeOfExamPlan) && <div>
        {Object.entries(JSON.parse(examRegulation?.jsonSchema)).map(
            (entry) => <PlanForm entry={entry} nestedKeys={''} level={0} />)}
        <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
          <FormLabel>Weitere Anmerkungen zum Prüfungs- bzw. Nebenfachplan (max. 5000 Zeichen)</FormLabel>
            <Textarea minRows={4} maxRows= {8}  onChange={(event) => {if (event.target.value.length > 5000) window.alert("Die Anmerkung ist zu lang, so kann nur ein Teil der Anmerkung gespeichert werden."); else {const examPlan = getExamPlan(); objectPath.set(examPlan, "area.notesStudent", event.target.value), setExamPlan(examPlan)}}} />
        </FormControl>
        <Button
          variant="outlined"
          sx={{ marginTop: 2, marginBottom: 2 }}
          onClick={() => console.log(getExamPlan())}
        >
          Als {typeOfExamPlan}-Entwurf speichern
        </Button>

      </div>}
      
    </>
  );
}
