import api from "./axios"

export const getrecentSnippet=async()=>{
        const response=await api.get("/snippet/recent")
        return response.data;
}