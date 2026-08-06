import ResultCard from "../../components/Snippet Result Card/ResultCard";
import "./SearchByTitle.css";

const SearchByTitle = () => {
    return (
        <div className="searchByTitle-container">
            <div className="searchByTitle-first-section">
                <div className="searchByTitle-headings">
                    <h1 id="searchByTitle-main-heading">Search Snippets By Title</h1>
                    <p id="searchByTitle-desc-main">Find snippet by title</p>
                </div>
                <div className="searchByTitle-input-wrapper">
                    <input type="text" id="search" placeholder="Search Snippet By Title" />
                </div>
            </div>
            
            <div className="searchByTitle-second-sec">
                <p id="searchByTitle-result-show">Results for <span>"react"</span> (2)</p>
                <div className="searchByTitle-resultCardList">
                    <ResultCard />
                    <ResultCard />
                    <ResultCard />
                    <ResultCard />
                    <ResultCard />
                    <ResultCard />
                    <ResultCard />
                    
                </div>
            </div>
        </div>
    );
};

export default SearchByTitle;