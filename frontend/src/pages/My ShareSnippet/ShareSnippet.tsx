import ResultCard from "../../components/Snippet Result Card/ResultCard"
import './ShareSnippet.css'
import { useNavigate } from "react-router-dom"

const MyShareSnippet=()=>{

    const navigate=useNavigate();

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
                <ResultCard/>
                <ResultCard/>
                <ResultCard/>
                <ResultCard/>
                <ResultCard/>
                <ResultCard/>
                <ResultCard/>
                
            </div>
        </div>
        </>
    )
}

export default MyShareSnippet