import api from "./axios";
export const oneSnippetDetail=async(id:number)=>{

    const response=await api.get(`/snippet/${id}`)
        return response;         

}

//get all versions of the particular snippet
export const snippetVersion=async(id:number)=>{

    const response=await api.get(`/snippet/versions/${id}`);
        return response;

}

export const generateTokenById=async(id:number)=>{
    const response=await api.get(`/snippet/share/${id}`);
    console.log(response)
    return response;
}

export const oneVersionDetail=async(snippetId:number,versionId:number)=>{
    console.log("here the vid: " ,versionId)
    const response=await api.get(`/snippet/${snippetId}/version/${versionId}`)
        return response;         

}

export const deleteSnippet=async(id:number)=>{
    const response=await api.delete(`/snippet/delete/${id}`)
    console.log(response)
}

export const deleteVersion=async(snippetId:number,id:number)=>{
    const response=await api.delete(`/snippet/delete/${snippetId}/version/${id}`)
    console.log(response)
}





