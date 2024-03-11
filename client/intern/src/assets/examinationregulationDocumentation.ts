const descriptions = {
    info: "Information about the examination plan properties, most of them are currently not implemented in automatic checking, just min and max Creditpoints",
    name: "The name of the examination plan area associated with it.",
    description: "A more detailed description of the examination plan area to explain its contents and purposes.",
    minCreditPointsOverall: "The minimum number of total credit points required for this area.",
    maxCreditPointsOverall: "The maximum number of total credit points allowed for this area.",
    minCreditPointsPraktikum: "The minimum number of credit points required for internships in this area.",
    maxCreditPointsPraktikum: "The maximum number of credit points allowed for internships in this area.",
    minCreditPointsSeminar: "The minimum number of credit points required for seminars in this area.",
    maxCreditPointsSeminar: "The maximum number of credit points allowed for seminars in this area.",
    minCreditPointsVorlesung: "The minimum number of credit points required for lectures in this area.",
    maxCreditPointsVorlesung: "The maximum number of credit points allowed for lectures in this area.",
    minExamPlanCheck: "The minimum number of examination plan areas to be checked in this area e.g. if you have 2 examination plan areas and the minimum is 1, students needs to validate at least 1 (e.g. gaining enough credit points in one examination plan area if it is specified) ",
    maxExamPlanCheck: "The maximum number of examination plan areas that can be checked in this area.",
    minSeminarsCount: "The minimum number of seminars to be completed in this area.",
    maxSeminarsCount: "The maximum number of seminars that can be completed in this area.",
    minPraktikumCount: "The minimum number of internships to be completed in this area.",
    maxPraktikumCount: "The maximum number of internships that can be completed in this area.",
    minVorlesungCount: "The minimum number of lectures to be completed in this area.",
    maxVorlesungCount: "The maximum number of lectures that can be completed in this area.",
    minModuleCount: "The minimum number of modules to be completed in this area.",
  examPlanArea: "You can define specific parts of the exam regulation e.g. 'Pflichtbereich', 'Wahlbereich', 'Studienleistungen'",
  modules: "Here you can define modules",
  moduleRange: "Here you can define modules but different from modules whole module ranges with regular expressions (not implemented yet)",
  };

  export default descriptions;