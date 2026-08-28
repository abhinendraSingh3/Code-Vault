import "./ShareTokenCard.css";
import { useNavigate } from "react-router-dom";

const ShareTokenCard = ({name,snippetId,token,type}) => {

    const navigate=useNavigate();

    const handleOpen=()=>{
        
        navigate('/snippetDetails',{
            state:{
                snippetId:snippetId
            }
        });

    }
    return (
        <div className="shareTokencard-main-body">
            <div className="shareTokencard-card-left">
                <div className="shareTokencard-card-icon">⚡</div>
                <div className="shareTokencard-card-text">
                    <p id="shareTokencard-title-snippet">{name}</p>
                    <p id="shareTokencard-desciption-snippet">Token: {token}</p>
                </div>
            </div>
            <div className="shareTokencard-card-right">
                <span className="shareTokencard-language-badge">Snippet type: {type}</span>
                <button id="shareTokencard-result-open" aria-label="View" onClick={handleOpen}>Open</button>
            </div>
        </div>
    );
};

export default ShareTokenCard;