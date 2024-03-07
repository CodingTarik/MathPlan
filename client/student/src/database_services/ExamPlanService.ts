import axios from 'axios';



export const saveExamPlan = (examPlanString: string, name:string) => {
    return axios.post('/api/intern/addExamPlan', {
        examPlanString: examPlanString,
        name: name
      });
  };

export const deleteExamPlan = (id:string) => {
    return axios.delete(`api/intern/deleteExamPlan/${id}`)
  }
  
