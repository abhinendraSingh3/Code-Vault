import ResultCard from "../../components/Snippet Result Card/ResultCard";
import "./Search.css";

const Search = () => {
    return (
        <div className="search-container">
            <div className="search-first-section">
                <div className="search-headings">
                    <h1 id="search-main-heading">Search Snippets</h1>
                    <p id="search-desc-main">Find snippet by title, language or keyword</p>
                </div>
                <div className="search-input-wrapper">
                    <input type="text" id="search" placeholder="Search Snippet" />
                </div>
            </div>
            
            <div className="search-second-sec">
                <p id="search-result-show">Results for <span>"react"</span> (2)</p>
                <div className="search-resultCardList">
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

export default Search;