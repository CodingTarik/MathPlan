let examPlan = new Object();

/**
 * setter 
 * @param newPlan 
 */
function setExamPlan(newPlan: object){
    examPlan = newPlan;
}

/**
 * 
 * @returns current exam plan
 */
function getExamPlan(){
    return examPlan;
}

export {setExamPlan, getExamPlan}