import "./ShareTokenCard.css";
import { useNavigate } from "react-router-dom";

const ShareTokenCard = ({name,token,type,}) => {

    const navigate=useNavigate();

    const handleOpen=()=>{
        navigate('/snippetDetails');

    }
    return (
        <div className="resultcard-main-body">
            <div className="resultcard-card-left">
                <div className="resultcard-card-icon">⚡</div>
                <div className="resultcard-card-text">
                    <p id="resultcard-title-snippet">{name}</p>
                    <p id="resultcard-desciption-snippet">Token: {token}</p>
                </div>
            </div>
            <div className="resultcard-card-right">
                <span className="resultcard-language-badge">Snippet type: {type}</span>
                <button id="resultcard-result-open" aria-label="View" onClick={handleOpen}>Open</button>
            </div>
        </div>
    );
};

export default ShareTokenCard;