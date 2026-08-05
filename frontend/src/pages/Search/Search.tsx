import ResultCard from "../../components/Snippet Result Card/ResultCard"
import "./Search.css"

const Search = () => {
    return (
        <>
            <div className="first-section">
                <div className="headings">
                    <p id="main-heading">Search Snippet</p>
                    <p id="desc-main">Find snippet by title,language or keyword</p>
                </div>
                <div className="search">
                    <input type="text" id="search" placeholder="Search Snippet"></input>
                </div>
            </div>
            < div className="second-sec">
                <p id="result-show"> Result for { }</p>
                    <div className="resultCard">
                        <ResultCard/>
                    </div>
            </div>

        </>

    )
}

export default Search