import Editor from "@monaco-editor/react"
import { useState } from "react"
import './EditSnippet.css'
import { useNavigate } from "react-router-dom"

export function EditSnippet() {

    const navigate=useNavigate();

    //one for data from backend
    const [originalData, setOriginalData] = useState({
        title: "Data from backend",
        language: "Java",
        code: "Hello this is the code",
        description: "the data from the backend",
        tags: ["one", "two", "three"]
    })
    //one for data currentdata
    const [snippet, setSnippet] = useState({
        title: "Data from backend",
        language: "Java",
        code: "Hello this is the code",
        description: "the data from the backend",
        tags: ["one", "two", "three"]
    });

    //one to track the editing if the editing button is clicked or not
    const [isEditing, setIsEditing] = useState(false)

    const updateData = () => {
        setOriginalData(snippet)
        setIsEditing(false)
        console.log(originalData)


    }


    return (
        <>

            <div className="editSnippet-body">

                <div className="editSnippet-backBtn">
                    <button id="backBtn" onClick={()=>navigate(-1)}>⟵ Back</button>
                </div>

                <div className="editSnippet-mainHeading">
                    <h1 id="editSnippet-heading">Update Snippet</h1>
                    <h4 id="editSnippet-subHeading">Update your code snippet</h4>
                </div>

                <div className="editSnippet-firstSection">
                    <div className="editSnippet-title">

                        <label id="editSnippet-titleMain">Title</label>
                        {isEditing ? (
                            <input id="editSnippet-title-inputEnabled"
                                type="text"
                                placeholder="Enter the title"
                                value={snippet.title}
                                onChange={(e) => setSnippet({ ...snippet, title: e.target.value })}
                            ></input>
                        ) : (<input id="editSnippet-title-inputDisabled" type="text" value={originalData.title} placeholder="Enter the title" disabled></input>)

                        }
                    </div>
                    <div className="editSnippet-languange">
                        <label id="editSnippet-languageMain">Language</label>
                        {isEditing ? (
                            <input id="editSnippet-language-inputEnabled"
                                type="text"
                                value={snippet.language}
                                placeholder="Enter the language"
                                onChange={(e) => setSnippet({ ...snippet, language: e.target.value })}
                            ></input>

                        ) : (<input id="editSnippet-language-inputDisabled"
                            type="text"
                            value={originalData.language}
                            placeholder="Enter Language"
                            disabled
                        ></input>

                        )}
                    </div>

                </div>

                <div className="editSnippet-code">
                    <Editor
                        height="50vh"
                        width="100%"
                        theme="vs-dark"
                    // value={}
                    // onChange={}
                    />
                </div>
                <div className="editSnippet-lastSection">


                    <div className="editSnippet-description">
                        <label id="editSnippet-descriptionMain">Description</label>
                        {isEditing ? (
                            <input id="editSnippet-description-inputEnabled"
                                type="text"
                                value={snippet.description}
                                placeholder="Enter the description"
                                onChange={(e) => setSnippet({ ...snippet, description: e.target.value })}
                            ></input>

                        ) : (<input id="editSnippet-description-inputDisabled"
                            type="text"
                            value={originalData.description}
                            placeholder="Enter Description"
                            disabled
                        ></input>

                        )}
                    </div>

                    <div className="editSnippet-tags">
                        <label id="editSnippet-tagsMain">tags</label>
                        {isEditing ? (
                            <input id="editSnippet-tags-inputEnabled"
                                type="text"
                                value={snippet.tags.join(" , ")}
                                placeholder="Enter the tags"
                                onChange={(e) => setSnippet({
                                    ...snippet,
                                    tags: e.target.value.split(",").map(tag => tag.trim())
                                })
                                }
                            ></input>

                        ) : (<input id="editSnippet-tags-inputEnabled"
                            type="text"
                            value={snippet.tags.join(" , ")}
                            placeholder="Enter the tags"
                            onChange={(e) => setSnippet({
                                ...snippet,
                                tags: e.target.value.split(",").map(tag => tag.trim())
                            })
                            }
                            disabled
                        ></input>

                        )}
                    </div>
                </div>
                <div className="editSnippet-buttonSec">
                    <button id="editSnippet-editBtn" onClick={() => setIsEditing(true)}>Edit</button>

                    {isEditing ?
                        (<button id="editSnippet-editBtn" onClick={() => setSnippet(originalData)}>Cancel</button>) :

                        (<button id="editSnippet-editBtn" disabled>Cancel</button>)
                    }

                    <button id="editSnippet-update" onClick={updateData}>Update</button>
                </div>

            </div >

        </>
    )
}