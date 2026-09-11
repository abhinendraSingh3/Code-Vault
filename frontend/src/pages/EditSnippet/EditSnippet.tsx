import Editor from "@monaco-editor/react"
import { useEffect, useState } from "react"
import './EditSnippet.css'
import { useNavigate, useLocation } from "react-router-dom"
import { oneSnippetDetail, updateSnippet } from "../../api/snippetsDetailApi"

interface EditSnippetFormData {
    title: string;
    language: string;
    code: string;
    description: string;
    tags: string[];
}

const emptyFormData: EditSnippetFormData = {
    title: "",
    language: "",
    code: "",
    description: "",
    tags: []
};

export function EditSnippet() {

    const navigate = useNavigate();
    const { state } = useLocation();
    const snippetId = state?.snippetId;

    const [originalData, setOriginalData] = useState<EditSnippetFormData>(emptyFormData);
    const [formData, setFormData] = useState<EditSnippetFormData>(emptyFormData);
    const [isEditing, setIsEditing] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const funcSample = async () => {
            if (!snippetId) return;

            const response = await oneSnippetDetail(snippetId);

            const fetchedData: EditSnippetFormData = {
                title: response.title ?? "",
                language: response.language ?? "",
                code: response.code ?? "",
                description: response.description ?? "",
                tags: response.tags ?? []
            };

            setOriginalData(fetchedData);
            setFormData(fetchedData);
        };

        funcSample();
    }, [snippetId]);

    const handleEdit = () => {
        setFormData(originalData);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData(originalData);
        setIsEditing(false);
    };

    const updateData = async () => {
        if (!snippetId) return;

        const changedData: Partial<{
            title: string;
            description: string;
            code: string;
            language: string;
            tag: string[];
        }> = {};

        if (formData.title !== originalData.title) changedData.title = formData.title;
        if (formData.language !== originalData.language) changedData.language = formData.language;
        if (formData.description !== originalData.description) changedData.description = formData.description;
        if (formData.code !== originalData.code) changedData.code = formData.code;

        const originalTags = originalData.tags.join(",");
        const currentTags = formData.tags.join(",");
        if (originalTags !== currentTags) changedData.tag = formData.tags;

        if (Object.keys(changedData).length === 0) {
            setIsEditing(false);
            return;
        }
        //api call
        const response= await updateSnippet(snippetId, changedData);
        console.log("Update response:", response);
        setSuccess(true);
        setOriginalData(formData);
        setIsEditing(false);
        setTimeout(() => {
            setSuccess(false);
        }, 2000);
    };

    return (
        <>
            <div className="editSnippet-body">
                <div className="editSnippet-backBtn">
                    <button id="backBtn" onClick={() => navigate(-1)}>⟵ Back</button>
                </div>

                <div className="editSnippet-mainHeading">
                    <h1 id="editSnippet-heading">Update Snippet</h1>
                    <h4 id="editSnippet-subHeading">Update your code snippet</h4>
                </div>

                <div className="editSnippet-firstSection">
                    <div className="editSnippet-title">
                        <label id="editSnippet-titleMain">Title</label>
                        <input
                            id={isEditing ? "editSnippet-title-inputEnabled" : "editSnippet-title-inputDisabled"}
                            type="text"
                            placeholder="Enter the title"
                            value={isEditing ? formData.title : originalData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="editSnippet-languange">
                        <label id="editSnippet-languageMain">Language</label>
                        <input
                            id={isEditing ? "editSnippet-language-inputEnabled" : "editSnippet-language-inputDisabled"}
                            type="text"
                            value={isEditing ? formData.language : originalData.language}
                            placeholder="Enter the language"
                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                <div className="editSnippet-code">
                    <Editor
                        height="50vh"
                        width="100%"
                        theme="vs-dark"
                        value={isEditing ? formData.code : originalData.code}
                        onChange={(value) => setFormData((prev) => ({ ...prev, code: value ?? "" }))}
                        options={{ readOnly: !isEditing }}
                    />
                </div>

                <div className="editSnippet-lastSection">
                    <div className="editSnippet-description">
                        <label id="editSnippet-descriptionMain">Description</label>
                        <input
                            id={isEditing ? "editSnippet-description-inputEnabled" : "editSnippet-description-inputDisabled"}
                            type="text"
                            value={isEditing ? formData.description : originalData.description}
                            placeholder="Enter the description"
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="editSnippet-tags">
                        <label id="editSnippet-tagsMain">tags</label>
                        <input
                            id="editSnippet-tags-inputEnabled"
                            type="text"
                            value={isEditing ? formData.tags.join(", ") : originalData.tags.join(", ")}
                            placeholder="Enter the tags"
                            onChange={(e) => setFormData({
                                ...formData,
                                tags: e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean)
                            })}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                <div className="editSnippet-buttonSec">
                    <button id="editSnippet-editBtn" onClick={handleEdit} disabled={isEditing}>Edit</button>

                    {isEditing ? (
                        <button id="editSnippet-editBtn" onClick={handleCancel}>Cancel</button>
                    ) : (
                        <button id="editSnippet-editBtn" disabled>Cancel</button>
                    )}

                    <button id="editSnippet-update" onClick={updateData} disabled={!isEditing}>Update</button>
                    {success && <span id="editSnippet-successMsg">Snippet updated !</span>}
                </div>
            </div>  
        </>
    )
}