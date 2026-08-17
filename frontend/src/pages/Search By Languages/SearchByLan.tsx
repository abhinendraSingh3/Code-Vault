import ResultCard from "../../components/Snippet Result Card/ResultCard";
import "./SearchByLan.css";
import Tags from "../../components/Tags/Tags";

const SearchByLang = () => {
    return (
        <div className="SearchByLang-container">

            <div className="SearchByLang-first-section">
                <div className="SearchByLang-headings">
                    <h1 id="SearchByLang-main-heading">Search Snippets By Languages</h1>
                    <p id="SearchByLang-desc-main">Find snippet by programing language</p>
                </div>
                <div className="SearchByLang-input-wrapper">
                    <input type="text" id="SearchByLang" placeholder="Search Snippet by language" />
                </div>
            </div>

        {/* all the tags from the backend will appear here */}
            <div className="SearchByLang-tags">
                <div className="SearchByLang-tags-bodyarea">
                    <Tags/>
                  
                </div>

            </div>
            
            <div className="SearchByLang-second-sec">
                <p id="SearchByLang-result-show">Results for <span>"react"</span> (2)</p>
                <div className="SearchByLang-resultCardList">
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

export default SearchByLang;