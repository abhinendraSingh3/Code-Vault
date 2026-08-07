import "./VersionCard.css";

const VersionCard = () => {
    return (
        <div className="VersionCard-main-body">

            <div className="VersionCard-card-left">

                <div className="VersionCard-card-icon">⚡</div>

                <div className="VersionCard-card-text">

                    <p id="VersionCard-title-snippet">React useFetch Hook</p>
                    <p id="VersionCard-desciption-snippet">Custom hook for data fetching in React</p>
                    <p id="VersionCard-updating-details">Updated 5 hours ago</p>

                </div>
            </div>
            <div className="VersionCard-card-right">
                <span className="VersionCard-language-badge">V1</span>
                <button id="VersionCard-result-open" aria-label="View">Open</button>
            </div>
        </div>
    );
};

export default VersionCard;