import api from "./axios"
import type{ RecentSnippetsResponse } from "../types/auth.types";

export const getrecentSnippet=async():Promise<RecentSnippetsResponse>=>{
        const response=await api.get("/snippet/recent")
        // console.log("response Data",response.data);
    return response.data


}

export const getAllSnippetsOfUser=async()=>{
    const response=await api.get("/snippet/all")

    return response.data

}