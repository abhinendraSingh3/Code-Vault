import "./VersionCard.css";
import { useNavigate } from "react-router-dom";

type propType = {
    snippetId: number
    id: number
    title: string
    description: string
    updatedAt: string
    versionNumber: number
    isCurrentVersion?: boolean
}

const VersionCard = (prop: propType) => {
    const navigate = useNavigate();

    return (
        <div className={`VersionCard-main-body ${prop.isCurrentVersion ? "VersionCard-current" : ""}`}>
            <div className="VersionCard-card-left">
                <div className="VersionCard-card-icon">⚡</div>
                <div className="VersionCard-card-text">
                    <p id="VersionCard-title-snippet">{prop.title}</p>
                    <p id="VersionCard-desciption-snippet">{prop.description}</p>
                    <p id="VersionCard-updating-details">{prop.updatedAt}</p>
                </div>
            </div>
            <div className="VersionCard-card-right">
                <span className="VersionCard-language-badge">{prop.versionNumber}</span>
                {prop.isCurrentVersion ? (
                    <span className="VersionCard-current-label">Currently viewing</span>
                ) : (
                    <button
                        id="VersionCard-result-open"
                        aria-label="View"
                        onClick={() =>
                            navigate('/snippetDetails', {
                                state: { versionId: prop.versionNumber, snippetId: prop.snippetId }
                            })
                        }
                    >
                        Open
                    </button>
                )}
            </div>
        </div>
    );
};

export default VersionCard;