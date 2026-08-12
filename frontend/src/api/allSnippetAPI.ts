import api from "./axios"

export const getALLSnippet=async(page:number, limit:number)=>{
    console.log("the page rtecieved is",page);
    
    const response=await api.get('snippet/all',{
        params:{
            page,
            limit

        }
    })
    return response.data
}