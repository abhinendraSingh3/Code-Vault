import api from "./axios";
import type { SnippetData } from "../types/auth.types";

export const createSnippet = async (payload: {
    title: string;
    description: string;
    code: string;
    language: string;
    tag: string[];
}) => {
    const response = await api.post('/snippet', payload);
    return response.data;
};

export const oneSnippetDetail = async (id: number): Promise<SnippetData> => {
    const response = await api.get<SnippetData>(`/snippet/${id}`);
    return response.data;

};

export const updateSnippet = async (id: number, payload: Partial<{
    title: string;
    description: string;
    code: string;
    language: string;
    tag: string[];
}>) => {
    const response = await api.post(`/snippet/${id}`, payload);
    return response.data;
};

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





