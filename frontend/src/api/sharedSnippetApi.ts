import api from "./axios"

export const sharedApi=async()=>{
    const response=await api.get('/snippet/share/myShares')
    return response;
}

export const oneSnippetDetail=async(id:number)=>{

    const response=await api.get(`/snippet/${id}`)
            console.log(response);
            

}