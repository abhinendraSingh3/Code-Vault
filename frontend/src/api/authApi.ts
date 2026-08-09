    import api from './axios'

    import type {SignUpData,LoginData} from '../types/auth.types'

    export const registerApi=async(data:SignUpData)=>{

        const response=await api.post('/auth/signup',data)

        return response;
        

    }

    export const loginApi=async(loginData:LoginData)=>{

        const response=await api.post('/auth/login',loginData);

        return response;

    }