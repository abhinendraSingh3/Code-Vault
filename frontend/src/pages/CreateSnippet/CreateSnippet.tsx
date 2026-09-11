import Editor from "@monaco-editor/react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createSnippet } from "../../api/snippetsDetailApi"
import './CreateSnippet.css'

const CreateSnippet = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [language, setLanguage] = useState("");
    const [description, setDescription] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [code, setCode] = useState("");

    const handleSave = async () => {
        const trimmedTitle = title.trim();
        const trimmedLanguage = language.trim();
        const trimmedDescription = description.trim();
        const tagList = tagsInput
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);

        if (!trimmedTitle || !trimmedLanguage || !trimmedDescription || !code) {
            alert("Title, language, description, and code are required.");
            return;
        }

        try {
            const payload = {
                title: trimmedTitle,
                language: trimmedLanguage,
                description: trimmedDescription,
                code,
                tag: tagList,
            };

            await createSnippet(payload);
            alert("Snippet created successfully!");
            navigate(-1);
        } catch (error) {
            console.error("Create snippet error:", error);
            alert("Failed to create snippet. Please try again.");
        }
    };

    return (
        <>
            <div className="main-body">
                <div className="main-heading">
                    <p id="new-snippet-title">Create New Snippet</p>
                    <p id="new-descripton">Add a new code snippet to your collection</p>
                </div>

                <div className="second-sec">
                    <div className="input-group">
                        <label id="title-label">Title</label>
                        <input
                            type="text"
                            id="snippet-title"
                            placeholder="Enter snippet title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label id="language">Language</label>
                        <input
                            type="text"
                            id="snippet-language"
                            placeholder="Enter snippet language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        />
                    </div>
                </div>

                <div className="third-sec">
                    <p id="code">Code</p>
                    <Editor
                        height="280px"
                        width="100%"
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value ?? "")}
                    />
                </div>

                <div className="fourth-sec">
                    <label id="snippet-description">Description</label>
                    <textarea
                        id="description-input"
                        placeholder="Enter the description for your snippet"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <input
                        type="text"
                        id="tags-input"
                        placeholder="Enter the tags for your snippet"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                    />
                </div>

                <div className="fifth-section">
                    <button id="cancle-btn" onClick={() => navigate(-1)}>Cancel</button>
                    <button id="save" onClick={handleSave}>Save</button>
                </div>
            </div>
        </>
    )
}

export default CreateSnippet