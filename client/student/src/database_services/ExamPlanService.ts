import axios from 'axios';



export const saveExamPlan = (examPlanString: string, name:string, type:string) => {
    return axios.post('/api/intern/addExamPlan', {
        examPlanString: examPlanString,
        name: name,
        typeOfPlan: type
      });
  };

/* export const deleteExamPlan = (id:string) => {
    return axios.delete(`api/intern/deleteExamPlan/${id}`)
  } */
  
