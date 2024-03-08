import axios from 'axios';


/**
 * 
 * @param examPlanString to be saved
 * @param name to be saved
 * @param type to be saved
 * @returns A promise that resolves to the saved exam Plan if the request is successful.
 */
export const saveExamPlan = (examPlanString: string, name:string, type:string) => {
    return axios.post('/api/intern/addExamPlan', {
        examPlanString: examPlanString,
        name: name,
        typeOfPlan: type
      });
  };

