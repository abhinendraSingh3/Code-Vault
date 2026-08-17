import "./ResultCard.css";
import { useNavigate } from "react-router-dom";

const ResultCard = ({title,description,language,updatedAt}) => {

    const navigate=useNavigate();

    const handleOpen=()=>{
        navigate('/snippetDetails');

    }
    return (
        <div className="resultcard-main-body">
            <div className="resultcard-card-left">
                <div className="resultcard-card-icon">⚡</div>
                <div className="resultcard-card-text">
                    <p id="resultcard-title-snippet">{title}</p>
                    <p id="resultcard-desciption-snippet">{description}</p>
                    <p id="resultcard-updating-details">{updatedAt}</p>
                </div>
            </div>
            <div className="resultcard-card-right">
                <span className="resultcard-language-badge">{language}</span>
                <button id="resultcard-result-open" aria-label="View" onClick={handleOpen}>Open</button>
            </div>
        </div>
    );
};

export default ResultCard;