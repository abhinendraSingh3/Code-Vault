import api from "./axios"

export const sharedApi=async()=>{
    const response=await api.get('/snippet/share/myShares')
    return response;
}