import { useEffect,useState } from "react";
import './ShareSnippet.css'
import ShareTokenCard from "../../components/Share Detail Card/ShareTokenCard";
import { useNavigate } from "react-router-dom"
import { sharedApi } from "../../api/sharedSnippetApi";
import type{ShareSnippetDetails} from '../../types/auth.types'

const MyShareSnippet=()=>{
    const[sharedSnippetFound, setShareSnippetFound]=useState(true);
    const [sharedDetails, setSharedDetails]=useState<ShareSnippetDetails[]>([])

    const navigate=useNavigate();

    useEffect(()=>{
        const extractDetails=async()=>{
            const response=await sharedApi();

            if(response.status==404){
                setShareSnippetFound(false);
            }
            setSharedDetails(response.data);
            
        }
        extractDetails()
    },[])

    return (
        <>
        <div className="allShareSnippet-main">
            <div className="allShareSnippet-backbtn">
                <button id="allSnippet-backBtn" onClick={()=>navigate(-1)}>⟵ Back</button>
            </div>
            <div className="allShareSnippet-mainHeading">
                <h1 id="allShareSnippet-title">My Shared Snippets</h1>
                <h4 id="allShareSnippet-subTitle">All of your shared snippets appear here</h4>
            </div>
            <div className="allShareSnippet-secondSec">

                {sharedSnippetFound ?(
                sharedDetails.map((detail)=>(
                    <ShareTokenCard
                    key={detail.snippetId}
                    snippetId={detail.snippetId}
                    name={detail.snippetName}
                    token={detail.shareToken}
                    type={detail.snippetType}
                    />
                   
                ))
            )
                :  ( <h1>No shared snippet found</h1>)
}
                
            </div>
        </div>
        </>
    )
}

export default MyShareSnippet