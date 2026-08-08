import { useState } from "react"
import Editor from "@monaco-editor/react"
import VersionCard from "../Snippet Version Cards/VersionCards";
import './SnippetDetails.css'
import { useNavigate } from "react-router-dom";


const SnippetDetails = () => {

    const navigate=useNavigate();


    const [activeTab, setActiveTab] = useState("code");

    return (
        <>
            <div className="snippetDetails-back">
                <button id="snippetDetails-back-btn" onClick={()=>{navigate(-1)}}>⟵ Back</button>
            </div>

            <div className="snippetDetails-first">
                <div className="snippetDetails-title">
                    <p id="snippetDetails-title">Data from Backend</p>
                    <p id="snippetDetails-description"> Data from Backend</p>
                </div>
                <div className="snippetDetails-rightSide">
                    <button id="snippetDetails-edit" onClick={()=>navigate('/editSnippet')}>Edit</button>
                    <button id="snippetDetails-Delete">Delete</button>
                </div>

            </div>

            <div className="snippetDetails-secondTab">

                <div className="snippetDetails-leftSide">
                    <div className="snippetDetails-tabs">

                        <button className={activeTab == "code" ? "active tab" : "tab"}
                        onClick={()=>setActiveTab("code")}>Code</button>

                        <button className={activeTab == "versions" ? "active tab" : "tab"}
                        onClick={()=>setActiveTab("versions")}
                        >Versions</button>
                        <button className={activeTab == "share" ? "active tab" : "tab"}
                        onClick={()=>setActiveTab("share")}
                        >Share</button>
                    </div>

                    <div className="snippetDetails-left-content">
                        {activeTab == "code" && (
                            <div className="snippetDetail-code">
                                
                                <button id="snippetDetail-codeMax">⛶</button>
                                <Editor
                                    height="60vh"
                                    width="100%"
                                    theme="vs-dark"
                                // value={}
                                // onChange={}
                                />
                            </div>

                        )}

                        {activeTab == "versions" && (
                            <div className="snippetDetail-versions">
                                <VersionCard />
                                <VersionCard />
                                <VersionCard />
                                <VersionCard />
                            </div>

                        )}

                        {activeTab == "share" && (
                            <div className="snippetDetail-share">
                                <div className="snippetDetailShare-heading">
                                    <h2 id="snippetDetailShare-headingH2"> Share Snippet</h2>
                                    <h4 id="snippetDetailShare-subheading">Share your snippet with others</h4>
                                </div>
                                <div className="snippetDetail-btn">
                                    <button id="snippetDetail-generate">Generate</button>
                                </div>
                                <div className="shareSnippet-Details">
                                    <input
                                        id="display-shareContent"
                                        type="text"
                                        value={""}
                                        readOnly
                                        placeholder="Generated token will be appeared here"
                                    />
                                    <button id="copyBtn">Copy</button>
                                </div>
                                <input
                                    id="display-shareContent"
                                    type="text"
                                    value={""}
                                    readOnly
                                    placeholder="Token url"
                                />
                                <input
                                    id="display-shareContent"
                                    type="text"
                                    value={""}
                                    readOnly
                                    placeholder="Token expiry"
                                />
                            </div>


                        )}
                    </div>

                </div>


                <div className="snippetsDetails-rightSide">
                    <div className="snippetDetailsRight-first">
                        <p id="snippetDetailsRight-detail">Details</p>
                        <p id="snippetDetailsRight-language">Language</p>
                        <p id="snippetDetailsRight-languageUsed">Java</p>
                        <p id="snippetDetailsRight-createdAtHeading">CreatedAt</p>
                        <p id="snippetDetailsRight-createdAt">May,12,2024</p>
                        <p id="snippetDetailsRight-updatedAt-heading">Updated At</p>
                        <p id="snippetDetailsRight-updatedAt"> may20,2024"</p>
                        <p id="snippetDetailsRight-versions-heading">Versions</p>
                        <p id="snippetDetailsRight-version-details">9</p>
                    </div>
                    <div className="snippetDetailsRight-second">
                        <p id="snippetDetailsRight-Actions">Actions</p>
                        <button id="snippetDetails-copyCode">Copy code</button>

                    </div>


                </div>

            </div>

        </>
    )
}
export default SnippetDetails