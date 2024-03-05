let examPlan = new Object();

function setExamPlan(newPlan: object){
    examPlan = newPlan;
}
function getExamPlan(){
    return examPlan;
}

export {setExamPlan, getExamPlan}