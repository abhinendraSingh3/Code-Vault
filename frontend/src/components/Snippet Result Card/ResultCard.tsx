import "./ResultCard.css"
const ResultCard=()=>{
    return (
        <>
        <div className="main-body">
            <div className="first-ele">
                <p id="title-snippet">Data from backend{}</p>
                <p id="desciption-snippet">Data from the backend{}</p>
                <p id="updating-details">Updated {} ago</p>
            </div>
            <div className="language-details">
                <p id="language-details">BackendData{}</p>
            </div>
            <div className="open-btn">
                <button id="result-open">Open</button>
            </div>
        </div>
        </>
    )
}

export default ResultCard