import Editor from "@monaco-editor/react"
import { useState } from "react"
import './CreateSnippet.css'

const CreateSnippet = () => {

    const [code, setCode] = useState("");

    function saveCode() {
        // set the code in setCode
        //call api and give the code to the backend
    }

    const [bigScreen, setBigScreen] = useState("")

    function handleBigScreen() {

        //set the big screen by changing the class itself
    }

    return (
        <>
            <div className="main-body">
                {/* 1 */}
                <div className="main-heading">
                    <p id="new-snippet-title">Create New Snippet</p>
                    <p id="new-descripton">Add a new code snippet to your collection</p>
                </div>
                {/* 2 */}
                <div className="second-sec">

                    <div className="input-group">
                        <label id="title-label">Title</label>
                        <input
                            type="text"
                            id="snippet-title"
                            placeholder="Enter snippet title"
                        />
                    </div>

                    <div className="input-group">
                        <label id="language">Language</label>
                        <input
                            type="text"
                            id="snippet-language"
                            placeholder="Enter snippet language"
                        />
                    </div>

                </div>
                {/* 3 */}
                <div className="third-sec">
                    <p id="code">Code</p>
                    <button id="editor-big" onClick={handleBigScreen}>⛶</button>
                    
                    <Editor
                        height="280px"
                        width="100%"
                        theme="vs-dark"
                        value={code}
                        onChange={saveCode}
                    />

                </div>
                {/* 4 */}
                <div className="fourth-sec">
                    <label id="snippet-description" >Description</label>
                    <textarea id="description-input" placeholder="Enter the description for your snippet" />
                    <input type="text" id="tags-input" placeholder="Enter the tags for your snippet" />

                </div>
                {/* 5 */}
                <div className="fifth-section">
                    <button id="cancle-btn">Cancel</button>
                    <button id="save">Save</button>
                </div>

            </div>
        </>
    )
}

export default CreateSnippet