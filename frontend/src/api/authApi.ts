import api from './axios'

export const registerApi=async()=>{

    const response=api.post('/auth/signup')

    return response;
    

}