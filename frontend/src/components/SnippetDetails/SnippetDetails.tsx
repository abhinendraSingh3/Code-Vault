import { useState, useEffect } from "react"
import Editor from "@monaco-editor/react"
import VersionCard from "../Snippet Version Cards/VersionCards";
import './SnippetDetails.css'
import { useLocation, useNavigate } from "react-router-dom";
import { oneSnippetDetail, oneVersionDetail, snippetVersion, generateTokenById, deleteSnippet,deleteVersion } from "../../api/snippetsDetailApi";
import type { SnippetData, SnippetVersion, shareTokenData } from "../../types/auth.types"

const SnippetDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const snippetId = state?.snippetId;
    const versionId = state?.versionId;

    const [activeTab, setActiveTab] = useState("code");
    const [snippetData, setSnippetData] = useState<SnippetData>();
    const [hasData, setHasData] = useState(true);
    const [versionData, setVersionData] = useState<SnippetVersion[]>();
    const [error, setError] = useState("");
    const [sharedData, setSharedData] = useState<shareTokenData>();
    const [copyMessage, setCopyMessage] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");


    useEffect(() => {
        const findDetails = async () => {
            if (versionId) {
                // Viewing a specific version — check this first since
                // snippetId is always present alongside versionId
                console.log("versionId", versionId);

                const response = await oneVersionDetail(snippetId, versionId);
                const formattedCode = response.data.code.replace(/\\n/g, "\n");
                setSnippetData({ ...response.data, code: formattedCode });
            }

            else if (snippetId) {
                // No version specified — show current/latest snippet
                const response = await oneSnippetDetail(snippetId);
                const formattedCode = response.data.code.replace(/\\n/g, "\n");
                setSnippetData({ ...response.data, code: formattedCode });
            }
        };

        if (snippetId || versionId) {
            findDetails();
        }
    }, [snippetId, versionId]);

    //for handling code
    const handleChange = () => {
        console.log();
    }

    //for handling versions
    const handleVersion = async () => {
        if (!snippetId) return;
        setDeleteMessage("")

        const response = await snippetVersion(snippetId);

        if (response.data.length === 0) {
            setHasData(false);
        } else {
            setHasData(true);
        }
        setVersionData(response.data);
    }

    //for handling shareToken
    const handleShare = async () => {
        if (!snippetId) return;

        try {
            setError("");
            const response = await generateTokenById(snippetId);
            setSharedData(response.data)
        }
        catch (error) {
            console.log("this is the error in snippetDetail", error)
            setSharedData(undefined)
            setError("Something went Wrong")
        }
    }

    const handleCopy = async () => {
        if (!sharedData?.token) {
            return;
        }
        await navigator.clipboard.writeText(sharedData.token);

        setCopyMessage("Token copied!");

        setTimeout(() => {
            setCopyMessage("");
        }, 2000);
    };

    const handleCopyCode = async () => {
        if (!snippetData?.code) {
            return;
        }

        await navigator.clipboard.writeText(snippetData.code);

        setCopyMessage("Code copied!");

        setTimeout(() => {
            setCopyMessage("");
        }, 2000);
    }


   const handleDelete = async () => {
    if (!snippetData?.id) return;

    try {
        if (isViewingVersion) {
            await deleteVersion(snippetId,snippetData.id);
            setDeleteMessage("Version deleted!");

        } 
        
        else {
            await deleteSnippet(snippetData.id);
            setDeleteMessage("Snippet deleted!");
        }

        setTimeout(async() => {
            if (isViewingVersion) {
                navigate('/snippetDetails', { state: { snippetId } });
                await handleVersion(); // refresh the version list so the deleted one disappears
                setActiveTab("versions");
            } else {
                navigate('/dashboard');
            }
        }, 900);
    } catch (error) {
        console.log("delete failed", error);
        setError("Something went wrong while deleting");
    }
};

    const isViewingVersion = Boolean(versionId);

    return (
        <>
            <div className="snippetDetails-back">
                <button id="snippetDetails-back-btn" onClick={() => { navigate(-1) }}>⟵ Back</button>
            </div>

            <div className="snippetDetails-first">
                <div className="snippetDetails-title">
                    <p id="snippetDetails-title">{snippetData?.title}</p>
                    <p id="snippetDetails-description"> {snippetData?.description}</p>
                    {isViewingVersion && (
                        <p className="snippetDetails-versionBanner">
                            Viewing version {snippetData?.versionNumber ?? ""} — read-only
                        </p>
                    )}
                </div>
                <div className="snippetDetails-rightSide">
                    <button
                        id="snippetDetails-edit"
                        disabled={isViewingVersion}
                        title={isViewingVersion ? "Go back to the live snippet to edit" : ""}
                        onClick={() => navigate('/editSnippet', { state: { snippetId } })}
                    >
                        Edit
                    </button>
                    <button
                        id="snippetDetails-Delete"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                    {deleteMessage && (
                        <p className="snippetDetail-copyMessage">
                            {deleteMessage}
                        </p>
                    )}
                </div>
            </div>

            <div className="snippetDetails-secondTab">

                <div className="snippetDetails-leftSide">
                    <div className="snippetDetails-tabs">

                        <button className={activeTab == "code" ? "active tab" : "tab"}
                            onClick={() => setActiveTab("code")}>Code</button>

                        <button className={activeTab == "versions" ? "active tab" : "tab"}
                            onClick={() => { handleVersion(); setActiveTab("versions"); }}
                        >Versions</button>
                        <button className={activeTab == "share" ? "active tab" : "tab"}
                            onClick={() => setActiveTab("share")}
                        >Share</button>
                    </div>

                    <div className="snippetDetails-left-content">
                        <div
                            className="snippetDetail-code"
                            style={{ display: activeTab === "code" ? "block" : "none" }}
                        >
                            <Editor
                                height="60vh"
                                width="100%"
                                theme="vs-dark"
                                value={snippetData?.code || ""}
                                options={{ readOnly: true }}
                            />
                        </div>

                        {activeTab == "versions" && (
                            <div className="snippetDetail-versions">
                                {hasData ? (
                                    versionData?.map((item) => (
                                        <VersionCard
                                            key={item.id}
                                            snippetId={snippetId}
                                            id={item.id}
                                            title={item.title}
                                            description={item.description}
                                            updatedAt={item.updatedAt}
                                            versionNumber={item.versionNumber}
                                            isCurrentVersion={versionId === item.versionNumber}
                                        />
                                    ))
                                ) : (
                                    <h1> No Versions Exist</h1>
                                )}
                            </div>
                        )}

                        {activeTab == "share" && (
                            <div className="snippetDetail-share">
                                <div className="snippetDetailShare-heading">
                                    <h2 id="snippetDetailShare-headingH2"> Share Snippet</h2>
                                    <h4 id="snippetDetailShare-subheading">Share your snippet with others</h4>
                                </div>
                                <div className="snippetDetail-btn">
                                    <button id="snippetDetail-generate"
                                        onClick={handleShare}
                                    >Generate</button>
                                </div>

                                <div className="shareSnippet-Details">
                                    <input
                                        id="display-shareContent"
                                        type="text"
                                        value={sharedData?.token ?? ""}
                                        readOnly
                                        placeholder="Generated token will be appeared here"
                                    />
                                    <button id="copyBtn" onClick={handleCopy}>Copy</button>
                                </div>
                                {copyMessage && (
                                    <p className="snippetDetail-copyMessage">
                                        {copyMessage}
                                    </p>)}
                                <input
                                    id="display-shareContent"
                                    type="text"
                                    value={sharedData?.url ?? ""}
                                    readOnly
                                    placeholder="Token url"
                                />
                                <input
                                    id="display-shareContent"
                                    type="text"
                                    value={sharedData?.expiresAt ?? ""}
                                    readOnly
                                    placeholder="Token expiry"
                                />
                                {error && (
                                    <p className="snippetDetail-error">
                                        {error}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="snippetsDetails-rightSide">
                    <div className="snippetDetailsRight-first">
                        <p id="snippetDetailsRight-detail">Details</p>
                        <p id="snippetDetailsRight-language">Language</p>
                        <p id="snippetDetailsRight-languageUsed">{snippetData?.language}</p>
                        <p id="snippetDetailsRight-createdAtHeading">CreatedAt</p>
                        <p id="snippetDetailsRight-createdAt">{snippetData?.createdAt}</p>
                        <p id="snippetDetailsRight-updatedAt-heading">Updated At</p>
                        <p id="snippetDetailsRight-updatedAt"> {snippetData?.updatedAt}</p>
                        <p id="snippetDetailsRight-versions-heading">Versions</p>
                        <p id="snippetDetailsRight-version-details">{snippetData?.versions}</p>
                    </div>
                    <div className="snippetDetailsRight-second">
                        <p id="snippetDetailsRight-Actions">Actions</p>
                        <button id="snippetDetails-copyCode" onClick={handleCopyCode}>Copy code</button>
                        {copyMessage && (
                            <p className="snippetDetail-copyMessage">
                                {copyMessage}
                            </p>)}
                    </div>
                </div>

            </div>

        </>
    )
}
export default SnippetDetails