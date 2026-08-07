import "./ResultCard.css";
import { useNavigate } from "react-router-dom";

const ResultCard = () => {

    const navigate=useNavigate();

    const handleOpen=()=>{
        navigate('/snippetDetails');

    }
    return (
        <div className="resultcard-main-body">
            <div className="resultcard-card-left">
                <div className="resultcard-card-icon">⚡</div>
                <div className="resultcard-card-text">
                    <p id="resultcard-title-snippet">React useFetch Hook</p>
                    <p id="resultcard-desciption-snippet">Custom hook for data fetching in React</p>
                    <p id="resultcard-updating-details">Updated 5 hours ago</p>
                </div>
            </div>
            <div className="resultcard-card-right">
                <span className="resultcard-language-badge">TypeScript</span>
                <button id="resultcard-result-open" aria-label="View" onClick={handleOpen}>Open</button>
            </div>
        </div>
    );
};

export default ResultCard;