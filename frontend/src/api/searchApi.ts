import api from "./axios"

//below is for search only
export const searchAnySnippet=async(anyKeyword:string)=>{
    try{
    const response=await api.get(`/snippet/search/${anyKeyword}`)
    
    return response;
    }
    catch(error){
        console.error("API Error:", error)
        throw error;
        
    }

}



//below is for search by title
export const searchByTitleApi=async(anyKeyword:string)=>{
    try{
    const response=await api.get(`/snippet/search/title/${anyKeyword}`)
    console.log(response);
    
    
    return response;
    }
    catch(error){
        console.error("API Error:", error)
        throw error;
        
    }

}

//below is for search by language
